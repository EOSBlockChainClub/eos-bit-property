#pragma once
#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/currency.hpp>
#include <string>

using namespace eosio;
using namespace std;


class reuttoken : public eosio::contract
{
    public:
      reuttoken(account_name self) : contract(self) {}

      // @abi action
      void create(account_name issuer,
                  string symbol_string,
                  uint8_t precision,
                  uint64_t max_supply);

      // @abi action
      void issue(account_name to, asset quantity, string memo);

      // @abi action
      void transfer(account_name from,
                    account_name to,
                    asset quantity,
                    string memo);

      void payment_token( const account_name token_contract,
                          const account_name from,
                          const account_name to,
                          const asset token_qty,
                          const string memo);

      inline asset get_supply(symbol_name sym) const;
      inline asset get_balance(account_name owner, symbol_name sym) const;

    private:
      // @abi table accounts i64
      struct account
      {
            asset balance;

            uint64_t primary_key() const { return balance.symbol.name(); }
      };


      // @abi table stat i64
      struct currencystat
      {
            account_name issuer;
            asset supply;
            symbol_type symbol;
            uint16_t max_supply;
            uint64_t primary_key() const { return supply.symbol.name(); }
      };

      typedef eosio::multi_index<N(accounts), account> accounts;
      typedef eosio::multi_index<N(stat), currencystat> stats;

      void sub_balance(account_name owner, asset value);
      void add_balance(account_name owner, asset value, account_name ram_payer);

    public:
      struct transfer_args
      {
            account_name from;
            account_name to;
            asset quantity;
            string memo;
      };
};

asset reuttoken::get_supply(symbol_name sym) const
{
      stats statstable(_self, sym);
      const auto &st = statstable.get(sym);
      return st.supply;
}

asset reuttoken::get_balance(account_name owner, symbol_name sym) const
{
      accounts accountstable(_self, owner);
      const auto &ac = accountstable.get(sym);
      return ac.balance;
}
