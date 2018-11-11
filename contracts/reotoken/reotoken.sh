#cleos create account eosio registrynft EOS7ckzf4BMgxjgNSYV22rtTXga8R9Z4XWVhYp8TBgnBi2cErJ2hn EOS7ckzf4BMgxjgNSYV22rtTXga8R9Z4XWVhYp8TBgnBi2cErJ2hn
#cleos create account eosio bcdatoken EOS7ckzf4BMgxjgNSYV22rtTXga8R9Z4XWVhYp8TBgnBi2cErJ2hn EOS7ckzf4BMgxjgNSYV22rtTXga8R9Z4XWVhYp8TBgnBi2cErJ2hn
#cleos create account eosio bcdetoken EOS7ckzf4BMgxjgNSYV22rtTXga8R9Z4XWVhYp8TBgnBi2cErJ2hn EOS7ckzf4BMgxjgNSYV22rtTXga8R9Z4XWVhYp8TBgnBi2cErJ2hn

eoscppx=~/eos/build/tools/eosiocpp
mycleos=~/eos/build/programs/cleos/cleos
unlock_wallet=~/unlock.sh

if [[ $# -lt 2 ]]; then
   echo "usage: nft.sh <ACCOUNT_NAME> <CONTRACT_NAME> <CLEAN>"
   exit 1
elif [[ $# -eq 3 ]]; then
   if [[ $3 -eq "CLEAN" ]]; then
      echo "Clean option supplied..."
      echo "*** abi, wast, wasm files purged...."
      rm *.abi *.wa??
      exit 1
   fi
fi

ACCOUNT=$1
CONTRACT=$2
CLEAN=$3

#$unlock_wallet
$eoscppx -g ${CONTRACT}.abi ${CONTRACT}.cpp &&
$eoscppx -o ${CONTRACT}.wast ${CONTRACT}.cpp
$mycleos set contract --clear ${ACCOUNT} ../${CONTRACT} --permission ${ACCOUNT} 
$mycleos set contract ${ACCOUNT} ../${CONTRACT} --permission ${ACCOUNT}


#mycleos push action nft create '{"issuer":"nft", "symb":"NFT"}' -p nft@active
#mycleos push action nft issue '{"to":"hacker1", "quantity":"40 NFT", "uris":"["eosio.io", "yahoo.com"]", "name":"eos_hackathon", "memo":"San Francisco"}' -p nft@active
#mycleos push action nft transfer '{"from":"registrynft", "to":"bcdutoken", "id":"1","quantity":"99 ", "memo":"transfer3"}' -p nft@active

