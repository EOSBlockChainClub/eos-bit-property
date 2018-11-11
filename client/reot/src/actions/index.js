import * as api from '../api';
import * as types from '../types';

const eosAccount = 'psychedelica';

export const fetchInvestments = () => (dispatch, getState) =>
	api.fetchInvestments(eosAccount).then(
		(response) => {
			dispatch({
				type: types.FETCH_INVESTMENTS_SUCCESS,
				response
			});
		},
		(error) => {
			dispatch({
				type: types.FETCH_INVESTMENTS_FAILURE,
				message: error.message || 'Something went wrong.'
			});
		}
	);

export const fetchOpportunities = () => (dispatch, getState) =>
	api.fetchOpportunities().then(
		(response) => {
			dispatch({
				type: types.FETCH_OPPORTUNITIES_SUCCESS,
				response
			});
		},
		(error) => {
			dispatch({
				type: types.FETCH_OPPORTUNITIES_FAILURE,
				message: error.message || 'Something went wrong.'
			});
		}
	);

export const fetchNews = () => (dispatch, getState) =>
	api.fetchNews().then(
		(response) => {
			dispatch({
				type: types.FETCH_NEWS_SUCCESS,
				response
			});
		},
		(error) => {
			dispatch({
				type: types.FETCH_NEWS_FAILURE,
				message: error.message || 'Something went wrong.'
			});
		}
	);

export const fetchMarket = (period) => (dispatch, getState) =>
	api.fetchMarket(period).then(
		(response) => {
			dispatch({
				type: types.FETCH_MARKET_SUCCESS,
				response
			});
		},
		(error) => {
			dispatch({
				type: types.FETCH_MARKET_FAILURE,
				message: error.message || 'Something went wrong.'
			});
		}
	);
