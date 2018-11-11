import { FETCH_INVESTMENTS_SUCCESS } from '../types';
import { combineReducers } from 'redux';
import _ from 'lodash';

const addInvestmentEntries = (state, action) => {
	const { response } = action;
	const investments = _.mapKeys(response, 'id');

	return {
		...state,
		...investments
	};
};

const investmentsById = (state = {}, action) => {
	switch (action.type) {
		case FETCH_INVESTMENTS_SUCCESS:
			return addInvestmentEntries(state, action);
		default:
			return state;
	}
};

const addInvestmentIds = (state, action) => {
	const { response } = action;
	//get an array of just the investment ids from the array of investment objects
	const investments = _.map(response, 'id');

	// Just add the new Investment ids to the list of all IDs, without duplicates
	return _.union(state, investments);
};

const allInvestments = (state = [], action) => {
	switch (action.type) {
		case FETCH_INVESTMENTS_SUCCESS:
			return addInvestmentIds(state, action);
		default:
			return state;
	}
};

const investmentsReducer = combineReducers({
	byId: investmentsById,
	allIds: allInvestments
});

export default investmentsReducer;

export const getInvestmentIds = (state) => state.allIds || [];

export const getInvestment = (state, id) => state.byId[id] || {};
