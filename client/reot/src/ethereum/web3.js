import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // Use Mist/MetaMask's provider
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.log('No web3? You should consider trying MetaMask!')
  //we are on the server *OR* the user is not running metamask
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  const provider = new Web3.providers.HttpProvider(
    // "https://rinkeby.infura.io/xEqvuZ5Z3dnG1FzJ5XYr" /* vishal */
    "http://18.217.227.228:8545/" /* now using rinkby internally */
  );

  web3 = new Web3(provider);
}

export default web3;
