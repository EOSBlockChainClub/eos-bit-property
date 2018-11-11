import axios from 'axios';

/* REOT Investments for an account */
//export const fetchInvestments = (account) => axios.get(`/api/accounts/${account}/investments`).then(({ data }) => data);

export const fetchInvestments = (account) =>
	Promise.resolve([
		{
			id: '1',
			token: 'ROET1',
			nftId: '1',
			balance: 3000,
			totalValue: 15000,
			tokenValue: 5
		},
		{
			id: '2',
			token: 'ROET2',
			nftId: '2',
			balance: 405,
			totalValue: 3847.5,
			tokenValue: 9.5
		}
	]);

export const fetchOpportunities = () =>
	Promise.resolve([
		{
			id: '1',
			token: 'ROET1',
			nftId: '1',
			marketValue: 3000000,
			custodian: 'psychedelica'
		},
		{
			id: '2',
			token: 'ROET2',
			nftId: '2',
			marketValue: 725000,
			custodian: 'hexmedgetyue'
		}
	]);

/* News & Market */
export const fetchNews = () => axios.get('/api/news').then(({ data }) => data);
export const fetchMarket = (period) => axios.get(`/api/graph/${period}`).then(({ data }) => data);
