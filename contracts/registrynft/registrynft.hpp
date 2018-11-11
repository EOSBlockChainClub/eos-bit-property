#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/currency.hpp>
#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/types.hpp>
#include <eosiolib/action.hpp>
#include <eosiolib/symbol.hpp>
#include <eosiolib/crypto.h>
#include <string>
//
using namespace eosio;
using std::string;
typedef uint64_t id_type;
typedef string uri_type;

// forward class decl.
// cross reference to external/3rd 
// contracts
namespace eosiosystem
{
  class system_contract;
}

class registrynft: public eosio::contract {


  public:
    //using contract::contract;
    //
    registrynft(account_name self):contract(self), token_status{PENDING} {}  //tokens(_self, _self) {}
    ~registrynft(){}

    // @abi action
    void create(const account_name issuer,
                const account_name stakeholders,
                const string symb, 
                uint16_t reg_cost);
    
    // @abi action
    void issue(const account_name to, 
          const uint64_t registrationId,
          const account_name owner,
          const asset value,
          const string address,
          const string title,
          const string description,
          const vector<string> uris);

    // @abi action
    void transfer(const account_name from, 
                  const account_name to, 
                  const uint64_t id, 
                  const string memo);
            
    // @abi action
    void burn(const account_name owner, const uint64_t report_num);
    // @abi action
    void setrampayer(account_name payer, uint64_t report_num);
    //
    /// @abi action
    void clearaccount(string accsymb);

    /// @abi action
    void clearstat(string statsymb);

    // @abi action
    void addtitle(const uint64_t id, const string title);

    // @abi action
    void setholder(const account_name acct_name, uint8_t issuance);
    //
    void apply(const account_name contract, const account_name action);
    
    // @abi table accounts i64
    struct account
    {
        asset balance;
        account_name token_contract;
        uint64_t primary_key() const {return balance.symbol.name();}
    };

    // @abi table stat i64
    struct stats
    {
        asset supply;
        uint64_t reg_cost;
        account_name issuer;
        account_name stakeholders;
        //
        uint64_t primary_key() const {return supply.symbol.name();}
        account_name get_issuer() const {return issuer;}
        //
    };
    // 
    // @abi table stakeholder i64
    struct stakeholder
    {   uint64_t id;
        uint8_t issuance;
        vector<account_name> stake_holder;
        //
        uint64_t primary_key() const {return id; }
    };   
   
  private:
    void distribute_reuttokens( const account_name from, 
                                const account_name to, 
                                const uint64_t reit_num, 
                                const asset quantity);
    //
    enum
    {
          PENDING = static_cast<uint8_t>(1),
          CREATED,
          ISSUED,
          MINTED,
          BURNED,
          SALETRANSFER,
          SOLD,
          COMPLETED
    };

    uint8_t token_status;

    // @abi table tokens i64
    struct token {
        uint64_t registrationId;
        account_name owner;
        asset value;
        asset nft_value;
        uint16_t reg_cost;
        string address;
        string description;
        string title;
        vector<string> uris;
        uint32_t registration_date;
        //
        uint64_t primary_key() const { return registrationId; }
        account_name get_owner() const {return owner;}
        asset get_value() const {return value;}
        uint64_t get_symbol() const { return value.symbol.name();}
        uint64_t get_title() const {return string_to_name(title.c_str());}
        //
        EOSLIB_SERIALIZE (token, (registrationId)(owner)(value)(title)
                         (reg_cost)(address)(title)(description)(uris))

    };
    //
    typedef multi_index<N(stakeholders), stakeholder> stake_table;
    using token_index = eosio::multi_index<N(tokens), token>;
    using account_index = eosio::multi_index<N(accounts), account>;
    using currency_index = eosio::multi_index<N(stat), stats, 
                                                    indexed_by<N(byissuer), 
                                                    const_mem_fun<stats, account_name, &stats::get_issuer>>>;
 
  private:
    friend eosiosystem::system_contract;

    // token admin support functions
    void sub_balance(account_name owner, asset value);
    void add_balance(account_name owner, asset value, account_name ram_payer);
    void sub_supply(asset quantity);
    void add_supply(asset quantity);
    void mint(account_name owner, account_name ram_payer, asset value, string uri, string name);
    void transfer_received(const currency::transfer &transfer, const account_name code);
};
