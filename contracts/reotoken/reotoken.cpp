#include "reotoken.hpp"

using namespace std;
using namespace eosio;

void reotoken::create( account_name issuer,
                       asset maximum_supply )
{
    require_auth( _self );

    auto sym = maximum_supply.symbol;
    eosio_assert( sym.is_valid(), "invalid symbol name" );
    eosio_assert( maximum_supply.is_valid(), "invalid supply");
    eosio_assert( maximum_supply.amount > 0, "max-supply must be positive");

    stats statstable( _self, sym.name() );
    auto existing = statstable.find( sym.name() );
    eosio_assert( existing == statstable.end(), "token with symbol already exists" );

    statstable.emplace( _self, [&]( auto& s ) {
    s.supply.symbol = maximum_supply.symbol;
    s.max_supply    = maximum_supply;
    s.issuer        = issuer;
    });
}


void reotoken::issue( account_name to, asset quantity, string memo )
{
    auto sym = quantity.symbol;
    eosio_assert( sym.is_valid(), "invalid symbol name" );
    eosio_assert( memo.size() <= 256, "memo has more than 256 bytes" );

    auto sym_name = sym.name();
    stats statstable( _self, sym_name );
    auto existing = statstable.find( sym_name );
    eosio_assert( existing != statstable.end(), "token with symbol does not exist, create token before issue" );
    const auto& st = *existing;

    require_auth( st.issuer );
    eosio_assert( quantity.is_valid(), "invalid quantity" );
    eosio_assert( quantity.amount > 0, "must issue positive quantity" );

    eosio_assert( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
    eosio_assert( quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");

    statstable.modify( st, 0, [&]( auto& s ) {
    s.supply += quantity;
    });

    add_balance( st.issuer, quantity, st.issuer );

    if( to != st.issuer ) {
    SEND_INLINE_ACTION( *this, transfer, {st.issuer,N(active)}, {st.issuer, to, quantity, memo} );
    }
}

void reotoken::transfer( account_name from,
                    account_name to,
                    asset        quantity,
                    string       memo )
{
    eosio_assert( from != to, "cannot transfer to self" );
    require_auth( from );
    eosio_assert( is_account( to ), "to account does not exist");
    auto sym = quantity.symbol.name();
    stats statstable( _self, sym );
    const auto& st = statstable.get( sym );

    require_recipient( from );
    require_recipient( to );

    eosio_assert( quantity.is_valid(), "invalid quantity" );
    eosio_assert( quantity.amount > 0, "must transfer positive quantity" );
    eosio_assert( quantity.symbol == st.supply.symbol, "symbol precision mismatch" );
    eosio_assert( memo.size() <= 256, "memo has more than 256 bytes" );


    sub_balance( from, quantity );
    add_balance( to, quantity, from );
}

void reotoken::sub_balance( account_name owner, asset value ) {
    accounts from_acnts( _self, owner );

    const auto& from = from_acnts.get( value.symbol.name(), "no balance object found" );
    eosio_assert( from.balance.amount >= value.amount, "overdrawn balance" );


    if( from.balance.amount == value.amount ) 
    {
        from_acnts.erase( from );
    } 
    else 
    {
        from_acnts.modify( from, owner, [&]( auto& a ) {
            a.balance -= value;
        });
    }
}

void reotoken::apply(const account_name contract, const account_name act)
{

    if (contract == _self)
    {
        auto &thiscontract = *this;

        switch (act)
        {
            EOSIO_API(reotoken, (create)(issue)(transfer) )
        };
    }
    else
    {

        if (act == N(transfer))
        {
            transferReceived(unpack_action_data<currency::transfer>(), contract);
            return;
        }
    }
}


void reotoken::add_balance( account_name owner, asset value, account_name ram_payer )
{
    accounts to_acnts( _self, owner );
    auto to = to_acnts.find( value.symbol.name() );
    if( to == to_acnts.end() ) {
        to_acnts.emplace( ram_payer, [&]( auto& a ){
            a.balance = value;
        });
    } else {
        to_acnts.modify( to, 0, [&]( auto& a ) {
            a.balance += value;
        });
    }
}

void reotoken::transferReceived(const currency::transfer &transfer, const account_name code)
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
    accounts accounts_table(_self, symbol_name);
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
        print("reotoken contract received distributions: adding funds", "\n");
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

    void apply(uint64_t receiver, uint64_t code, uint64_t action)
    {
        auto self = receiver;
        reotoken contract(self);
        contract.apply(code, action);
        eosio_exit(0);
    }
}

//EOSIO_ABI( eosio::token, (create)(issue)(transfer) )using namespace std;
