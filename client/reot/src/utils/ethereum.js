import web3 from '../ethereum/web3';

export const getCoinbase = async () => await web3.eth.getCoinbase();
export const getAccounts = async () => await web3.eth.getAccounts();

export const getAccountBalance = async (address) => {
	const balWei = await web3.eth.getBalance(address);
	const balEth = fromWei(balWei);
	return balEth;
};

export const isAddress = (address) => web3.utils.isAddress(address) && !isNullAddress(address);

export const isNullAddress = (address) => web3.toBigNumber(address).isZero();

export const toWei = (val) => web3.utils.toWei(val, 'ether');
export const fromWei = (val) => web3.utils.fromWei(val, 'ether');

export const generateHash = (val) => web3.utils.sha3(val);
