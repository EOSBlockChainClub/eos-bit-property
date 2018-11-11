#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include "reuttoken.hpp"

using namespace eosio;
using namespace std;

void reuttoken::create(account_name issuer,
                       string symbol_string,
                       uint8_t precision,
                       uint64_t max_supply)
{
    require_auth( _self );

    symbol_type sym = string_to_symbol (precision, symbol_string.c_str());
    eosio_assert( sym.is_valid(), "invalid symbol name" );
        
    stats statstable( _self, sym.name() );
    auto existing = statstable.find( sym.name() );
    eosio_assert( existing == statstable.end(), "token with symbol already exists" );

    statstable.emplace( _self, [&]( auto& s ) {
        s.issuer        = issuer;
        s.symbol        = sym;
        s.supply.symbol = sym;
        s.max_supply    = max_supply;
    });

}

void reuttoken::issue(account_name to, asset quantity, string memo)
{
    auto sym = quantity.symbol;
    eosio_assert(sym.is_valid(), "invalid symbol name");
    
    eosio_assert(memo.size() <= 256, "memo has more than 256 bytes");

    auto sym_name = sym.name();
    stats statstable(_self, sym_name);
    auto existing = statstable.find(sym_name);
    eosio_assert(existing != statstable.end(), "reuttoken with symbol does not exist, create reuttoken before issue");
    const auto &st = *existing;

    require_auth(st.issuer);
    eosio_assert(quantity.is_valid(), "invalid quantity");
    eosio_assert(quantity.amount > 0, "must issue positive quantity");
    eosio_assert(st.supply.amount <= st.max_supply, "quantity to be issued exceeds max-supply!!" );

    print("quantity-symbol: ", quantity.symbol, "\n");
    print("supply-symbol: ", st.symbol, "\n");
    eosio_assert(quantity.symbol == st.supply.symbol, "symbol precision mismatch");


    statstable.modify(st, 0, [&](auto &s) {
        s.supply += quantity;
    });

    add_balance(st.issuer, quantity, st.issuer);
    //
    if (to != st.issuer)
    {
        SEND_INLINE_ACTION(*this, transfer, {st.issuer, N(active)}, {st.issuer, to, quantity, memo});
    }
    //   

}


void reuttoken::transfer(account_name from,
                         account_name to,
                         asset quantity,
                         string memo)
{
    eosio_assert(from != to, "cannot transfer to self");
    require_auth(from);
    eosio_assert(is_account(to), "to account does not exist");
    auto sym = quantity.symbol.name();
    stats statstable(_self, sym);
    const auto &st = statstable.get(sym);
    //
    require_recipient(from);
    require_recipient(to);
    //
    eosio_assert(quantity.is_valid(), "invalid quantity");
    eosio_assert(quantity.amount > 0, "must transfer positive quantity");
    eosio_assert(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
    eosio_assert(memo.size() <= 256, "memo has more than 256 bytes");
    //
    sub_balance(from, quantity);
    add_balance(to, quantity, from);
}

void reuttoken::sub_balance(account_name owner, asset value)
{
    accounts from_acnts(_self, owner);
    //
    const auto &from = from_acnts.get(value.symbol.name(), "no balance object found");
    eosio_assert(from.balance.amount >= value.amount, "overdrawn balance");
    //
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

void reuttoken::add_balance(account_name owner, asset value, account_name ram_payer)
{
    accounts to_acnts(_self, owner);
    auto to = to_acnts.find(value.symbol.name());
    if (to == to_acnts.end())
    {
        to_acnts.emplace(ram_payer, [&](auto &a) {
            a.balance = value;
        });
    }
    else
    {
        to_acnts.modify(to, 0, [&](auto &a) {
            a.balance += value;
        });
    }
}


void payment_token( const account_name token_contract, const account_name from, const account_name to,
                    const asset token_qty, const string memo)
{

    print("---------- Payment -----------\n");
    print("Token Contract   : ", name{token_contract}, "\n");
    print("From             : ", name{from}, "\n");
    print("To               : ", name{to}, "\n");
    print("Amount           : ", token_qty, "\n");
    print("Memo             : ", memo, "\n");
    //
    action(
        permission_level{from, N(active)},
        token_contract, N(transfer),
        std::make_tuple(from, to, token_qty, memo))
        .send();

    print("---------- End Payment -------\n");
}

EOSIO_ABI(reuttoken, (create)(issue)(transfer))