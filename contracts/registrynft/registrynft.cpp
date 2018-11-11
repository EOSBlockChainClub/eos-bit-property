#pragma GCC diagnostic ignored "-Wunused-parameter"
#include "registrynft.hpp"
#include <iostream>
#include <sstream>
#include <string>
#include <functional>
#include <cmath>
//
using namespace std;
using namespace eosio;


void registrynft::create(const account_name issuer,
                         const account_name stakeholders,
                         const string symb, 
                         uint16_t reg_cost)
{
    require_auth(issuer);
    eosio_assert(is_account(issuer), "Issuer does not exist");
    eosio_assert(token_status == PENDING, "property registry already created!!");
    //
    asset supply(0, string_to_symbol(0, symb.c_str()));
    auto symbol = supply.symbol; 
    //
    print("asset-symbol:",symb, "\n");
    print("captured-symbol:", symbol, "\n");
    //
    eosio_assert(symbol.is_valid(), "invalid symbol name!!");
    eosio_assert(supply.is_valid(), "invalid supply!!");

    // Check if currency with symbol already exists
    currency_index currency_table(_self, symbol.name() );
    auto existing_currency = currency_table.find(symbol.name());
    eosio_assert(existing_currency == currency_table.end(), "token with symbol already exists");
    //
    // Create new currency, initialize stat table
    currency_table.emplace(_self, [&](auto &currency){
        currency.supply = supply;
        currency.issuer = issuer;
        currency.stakeholders = stakeholders;
        currency.reg_cost = reg_cost;
    });
    //
    token_status = CREATED;
    print("token created..", "\n");
}

void registrynft::clearaccount(string accsymb)
{
    require_auth(_self);
    //
    eosio_assert(accsymb.c_str() != NULL, "registry symbol not set");
    symbol_type reg_symbol = string_to_symbol(0, accsymb.c_str());
    //
    account_index accounts_table(_self, reg_symbol.name());
    auto current_account = accounts_table.find(reg_symbol.name());
    if(current_account != accounts_table.end())
        accounts_table.erase(current_account);

}


void registrynft::clearstat(string statsymb)
{
    require_auth(_self);
    //
    eosio_assert(statsymb.c_str() != NULL, "registry symbol not set");
    symbol_type reg_symbol = string_to_symbol(0, statsymb.c_str());
    //
    currency_index currency_table(_self, reg_symbol.name() );
    auto existing_currency = currency_table.find(reg_symbol.name());
    if(existing_currency != currency_table.end())
        currency_table.erase(existing_currency);

}


void registrynft::addtitle(const uint64_t id, const string title)
{

    token_index token_table(_self, _self);
    auto this_token = token_table.find(id);
    eosio_assert(this_token != token_table.end(), "token does not exist for this id!!");
    //
    token_table.modify(this_token, _self, [&](auto &t) {
        t.title = title;
    });
}

void registrynft::issue(const account_name to, 
                        const uint64_t registrationId,
                        const account_name owner,
                        const asset value,
                        const string address,
                        const string title,
                        const string description,
                        const vector<string> uris)
{
    // Check if registrant account exists
    eosio_assert(is_account(to), "registrant account does not exist!!");
    
    // capture symbol   
    print("issuing asset-amount: ",value.amount, "\n");
    print("issuing asset-symbol: ",value.symbol, "\n");
    //
    eosio_assert(value.is_valid(), "invalid asset type");
    symbol_type symbol = value.symbol;
        
    eosio_assert(symbol.precision() == 0, "quantity must be whole number");
    eosio_assert(title.size() <= 32, "name has more than 32 bytes");
    eosio_assert(title.size() > 0, "name is empty");
    eosio_assert(value.amount > 0, "must issue positive quantities of NFTs");
    
    // ensure currecy instrument object has been created
    auto symbol_name = symbol.name();
    print("symbol_name: ", symbol_name, "\n");
    currency_index currency_table(_self, symbol_name);
    auto existing_currency = currency_table.find(symbol_name);
    eosio_assert(existing_currency != currency_table.end(), "token with symbol does not exist, create token before issue");
    const auto& st = *existing_currency;
    //
    require_auth(st.issuer);
    eosio_assert(value.is_valid(), "invalid quantity");
    eosio_assert(value.amount > 0, "must issue positive NFT quantities");
    eosio_assert(symbol == st.supply.symbol, "symbol precision mismatches!!");
    //
    token_index token_table(_self, _self);
    token_table.emplace(_self, [&](auto &t){
        t.registrationId = registrationId;
        t.owner = owner;
        t.value = value; 
        t.reg_cost = st.reg_cost;
        t.address = address;
        t.title = title;
        t.description = description;
        t.registration_date = now();
    });
   
    // increase supply
    add_supply(value);

    // Mint nfts
    for(auto const &uri : uris)
    {
       mint(to, st.issuer, asset{1, string_to_symbol(0, "RNFT")}, uri, title);
    }

    // Add balance to account
    add_balance(to, value, st.issuer);

    // distribute to stakeholders
    distribute_reuttokens(st.issuer, st.stakeholders, registrationId, value);

    token_status = ISSUED;
    print("Token Issued with Status: ", static_cast<int>(token_status), "\n");

}


void registrynft::distribute_reuttokens(const account_name from, 
                                        const account_name to, 
                                        const uint64_t reit_num, 
                                        const asset quantity)
{
    account_index accounts(_self, quantity.symbol.name());
    auto current_account = accounts.find(quantity.symbol.name());
    eosio_assert(current_account != accounts.end(), "No accounts found for symbol-token!!");
    //    
    string memo("Distributing tokens to reit contract..");
    print("from: ", from, "\n");
    print("reit_stakeholders: ", to, "\n");
    print("REIT-Num: ", reit_num);
    print("Asset: ", quantity, "\n");
    print("token contract", current_account->token_contract, "\n");
    print(memo," Balance Distributed: ", quantity, "\n");
    //    
    SEND_INLINE_ACTION(*this, transfer, {from, N(active)}, {from, to, reit_num, memo});
    //SEND_INLINE_ACTION(*this, transfer, {from, N(active)}, {from, to, report_num, qty, memo});
    //
    print("Transferred tokens to reit contract.., Balance Transferred: ", quantity);
    print("finished token distribution..", "\n");

}

void registrynft::setholder(const account_name acct_name, uint8_t issuance)
{
    stake_table nftstakes(_self, _self);
    auto current_holder = nftstakes.find(acct_name);
    //  
    if(current_holder ==  nftstakes.end())
    {
            nftstakes.emplace(_self, [&](auto &tok){
                tok.stake_holder.push_back(acct_name);
                tok.issuance = issuance;
            });
    }
    else
    {
            nftstakes.modify(current_holder, 0, [&](auto &t) {
                t.stake_holder.push_back(acct_name);
            });
    }
}


void registrynft::transfer(const account_name from, 
                    const account_name to, 
                    const uint64_t reg_id,  
                    const string memo)

{

    // Ensure authorized to send from account
    eosio_assert(from != to, "cannot transfer to self");
    require_auth(from);

    // Ensure 'to' account exists
    eosio_assert(is_account(to), "to account does not exist");

    // Check memo size and print
    eosio_assert(memo.size() <= 256, "memo has more than 256 bytes");

    // Ensure token ID exists
    token_index token_table(_self, _self);
    auto sender_token = token_table.find(reg_id);
    eosio_assert(sender_token != token_table.end(), "token with specified ID does not exist");

    // Ensure ownwer owns token
    eosio_assert(sender_token->owner == from, "sender does not own token with specified ID");
    const auto &st = *sender_token;

    // Notify both recipients
    require_recipient(from);
    require_recipient(to);

    // Transfer NFT from sender to receiver
    token_table.modify(st, from, [&](auto &t) {
        t.owner = to;
    });

    // Change balance of both accounts
    sub_balance(from, st.value);
    add_balance(to, st.value, from);
    //
    token_status = SALETRANSFER;
}


void registrynft::burn(const account_name owner, const uint64_t id)
{
    require_auth(owner);

    // Find property to burn
    token_index token_table(_self, _self);
    auto burn_token = token_table.find(id);
    eosio_assert(burn_token != token_table.end(), "token with id does not exist!!");
    eosio_assert(burn_token->owner == owner,  "token not owned by account!!");

    asset burnt_supply = burn_token->value;
    //asset burnt_supply;

    // remove tokens from table
    token_table.erase(burn_token);

    // lower balance from owner
    sub_balance(owner, burnt_supply);

    //lower supply from currency
    sub_supply(burnt_supply);
}


void registrynft::setrampayer(account_name payer, uint64_t id)
{
    require_auth(payer);
    //
    // Ensure tokenId exists
    token_index token_table(_self, _self);
    auto payer_token = token_table.find(id);
    eosio_assert(payer_token != token_table.end(), "token with this id does not exist!!");
    //
    // ensure payer owns token
    eosio_assert(payer_token->owner == payer, "payer does not own token with specified ID");
    const auto& st = *payer_token;

    // notify player
    require_recipient(payer);
    //
    token_table.erase(payer_token);
    token_table.emplace(payer, [&](auto& token){
        token.registrationId = st.registrationId;
        token.owner = st.owner;
        token.value = st.value;
        token.title = st.title;
        token.registration_date = now();
    });
    //
    sub_balance(payer, st.value);
    add_balance(payer, st.value, payer);
}

void registrynft::mint(account_name owner, account_name ram_payer, asset value, string uri, string title)
{
    token_index token_table(_self, _self);
    token_table.emplace(ram_payer, [&](auto& tok){
        tok.registrationId = token_table.available_primary_key();
        tok.owner = owner;
        tok.nft_value = value;
        tok.title = title;
        tok.registration_date = now();
    }); 
}

void registrynft::add_balance(account_name owner, asset value, account_name ram_payer)
{
    account_index to_accounts(_self, owner);
    auto to = to_accounts.find(value.symbol.name());
    //
    if (to == to_accounts.end())
    {
        print("Adding to Balance, Value: ", value, "\n");
        to_accounts.emplace(ram_payer, [&](auto &a) {
            a.balance = value;
        });
    }
    else
    {
        print("Accruing Balance with value: ", value, "\n");
        to_accounts.modify(to, 0, [&](auto &a) {
            a.balance += value;
        });
    }
}

void registrynft::sub_balance(account_name owner, asset value)
{
    print("sub-balance-name: ", N(value.symbol.name()), "\n");
    //
    account_index from_acnts(_self, owner);
    const auto& from = from_acnts.get(value.symbol.name(), "no balance object found");
    print("sub-balance-amount: ", value.amount, "\n");
    print("from-balance-amount: ", from.balance.amount, "\n");
    eosio_assert(from.balance.amount <= value.amount, "overdrawn balances!!");
    

    if (from.balance.amount == value.amount)
    {
        from_acnts.erase(from);
    }
    else
    {
        from_acnts.modify(from, owner, [&](auto &a) {
            a.balance -= value;
        });
    }  
}

void registrynft::sub_supply(asset quantity)
{
    auto symbol_name = quantity.symbol.name();
    currency_index currency_table(_self, symbol_name);
    auto current_currency = currency_table.find(symbol_name);

    currency_table.modify(current_currency, 0, [&](auto &currency) {
        currency.supply -= quantity;
    });
}

void registrynft::add_supply(asset quantity)
{
    auto symbol_name = quantity.symbol.name();
    currency_index currency_table(_self, symbol_name);
    auto current_currency = currency_table.find(symbol_name);
    print("symbol-name is: ", symbol_name, "\n");
    eosio_assert(current_currency != currency_table.end(), "currency not found for symbol-name");

    currency_table.modify(current_currency, 0, [&](auto &currency) {
        currency.supply += quantity;
    });
}



void registrynft::apply(const account_name contract, const account_name action_type)
{
    auto &thiscontract = *this;
    switch(action_type)
    {
        case N(create):
            print("apply::create()", "\n");
            switch(action_type)
            {
                EOSIO_API(registrynft,  (create)(issue)(transfer)(setrampayer)(addtitle)(clearstat)
                                        (clearaccount)(burn))
            };
        break;
        //
        
        case N(issue):
            print("apply::issue():", "\n");
            switch(action_type)
            {
                print("apply::issue() received..., notifying registrynft::issue()");
                EOSIO_API(registrynft,  (create)(issue)(transfer)(setrampayer)(addtitle)
                                        (clearstat)(clearaccount)(burn))
                                        
            };

        break;
        
        //
        case N(transfer):

            if( contract == _self)
            {                
                switch(action_type)
                {
                    EOSIO_API(registrynft, (create)(issue)(transfer)(setrampayer)(addtitle)
                                            (clearstat)(clearaccount)(burn))
                };
            }
            else
            {
                print("transfer--notify() received in registrynft");
                print("contract:", contract, "action: ", action_type);
                transfer_received(unpack_action_data<currency::transfer>(), contract); 

            }
        break;
        //
        case N(withdraw):
            if( contract == _self)
            {
                switch(action_type)
                {
                    EOSIO_API(registrynft, (create)(issue)(transfer)(setrampayer)(addtitle)(clearstat)
                            (clearaccount)(burn))
                };
            }
            else
            {
                ; //apply_withdrawal(unpack_action_data<withdraw>(), contract);
            }
        break;
        //
        default:
            switch(action_type)
            {
                EOSIO_API(registrynft,  (create)(issue)(transfer)(setrampayer)(addtitle)(clearstat)(clearaccount)(burn))
            };
    }//end_switch
}


void registrynft::transfer_received(const currency::transfer &transfer, const account_name code)
{
    // validate transfer.from is not the same as transfer.to
    eosio_assert(transfer.from != transfer.to, "Error: transfer.from and transfer.to accounts cannot be the same!!");
    //
    print("\n");
    print("Account Name     :   ", name{code}, "\n");
    print("From             :   ", name{transfer.from}, "\n");
    print("To               :   ", name{transfer.to}, "\n");
    print("Asset            :   ", transfer.quantity, "\n");
    print("Received Amount  :   ", transfer.quantity.amount, "\n");
    print("Received Symbol  :   ", transfer.quantity.symbol, "\n");
    print("Memo             :   ", transfer.memo, "\n");
    //
    auto symbol_name = transfer.quantity.symbol.name();
    account_index accounts_table(_self, symbol_name);
    auto acct_iter = accounts_table.find(symbol_name);
    asset new_balance;
    
    //
    if(acct_iter != accounts_table.end())
    {
        print("transfer_received: updating funds", "\n");
        eosio_assert(acct_iter->token_contract == code, "Transfer does not match existing token contract");
        accounts_table.modify(acct_iter, transfer.from, [&](auto &bal) {
            bal.balance += transfer.quantity;
            new_balance = bal.balance;
        });
    }
    else
    {
        print("transfer_received: adding funds", "\n");
        accounts_table.emplace(transfer.from, [&](auto& bal){
            bal.balance = transfer.quantity;
            bal.token_contract = code;
            new_balance = bal.balance;
        });
    }
    //
    print(name{transfer.from}, " deposited:     ", transfer.quantity, "\n");
    print(name{transfer.from}, " funds available: ", new_balance, "\n");
    print("registrynft available funds  : ", new_balance, "\n");

}


extern "C"
{
    using namespace eosio;
    //
    void apply(uint64_t receiver, uint64_t code, uint64_t action)
    {
        auto self = receiver;
        registrynft contract(self);
        contract.apply(code, action);
        eosio_exit(0);
    }
}
