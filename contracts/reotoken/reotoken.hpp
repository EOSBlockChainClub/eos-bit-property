/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#pragma once
#include <eosiolib/eosio.hpp>
#include <eosiolib/currency.hpp>
#include <eosiolib/asset.hpp>

#include <string>

using namespace std;
using namespace eosio;

namespace eosiosystem 
{
   class system_contract;
}


using std::string;

class reotoken : public eosio::contract {
public:
      reotoken( account_name self ):contract(self){}

      void create( account_name issuer,
                  asset        maximum_supply);

      void issue( account_name to, asset quantity, string memo );

      void transfer( account_name from,
                  account_name to,
                  asset        quantity,
                  string       memo );


      inline asset get_supply( symbol_name sym )const;
      //
      inline asset get_balance( account_name owner, symbol_name sym )const;             
      void transferReceived(const currency::transfer &transfer, const account_name code);
      void apply(const account_name contract, const account_name act);


private:
      struct account {
      asset    balance;
      account_name token_contract;
      uint64_t primary_key()const { return balance.symbol.name(); }
      };

      struct currency_stats {
      asset          supply;
      asset          max_supply;
      account_name   issuer;

      uint64_t primary_key()const { return supply.symbol.name(); }
      };

      typedef eosio::multi_index<N(accounts), account> accounts;
      typedef eosio::multi_index<N(stat), currency_stats> stats;
private:
      friend eosiosystem::system_contract;
      //
      void sub_balance( account_name owner, asset value );
      void add_balance( account_name owner, asset value, account_name ram_payer );

public:
      struct transfer_args {
      account_name  from;
      account_name  to;
      asset         quantity;
      string        memo;
      };
};

asset reotoken::get_supply( symbol_name sym )const
{
      stats statstable( _self, sym );
      const auto& st = statstable.get( sym );
      return st.supply;
}

asset reotoken::get_balance( account_name owner, symbol_name sym )const
{
      accounts accountstable( _self, owner );
      const auto& ac = accountstable.get( sym );
      return ac.balance;
}

