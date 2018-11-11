import { FETCH_OPPORTUNITIES_SUCCESS } from '../types';
import { combineReducers } from 'redux';
import _ from 'lodash';

const addOpportunityEntries = (state, action) => {
	const { response } = action;
	const opportunities = _.mapKeys(response, 'id');

	return {
		...state,
		...opportunities
	};
};

const opportunitiesById = (state = {}, action) => {
	switch (action.type) {
		case FETCH_OPPORTUNITIES_SUCCESS:
			return addOpportunityEntries(state, action);
		default:
			return state;
	}
};

const addOpportunityIds = (state, action) => {
	const { response } = action;
	//get an array of just the investment ids from the array of investment objects
	const opportunities = _.map(response, 'id');

	// Just add the new Opportunity ids to the list of all IDs, without duplicates
	return _.union(state, opportunities);
};

const allOpportunities = (state = [], action) => {
	switch (action.type) {
		case FETCH_OPPORTUNITIES_SUCCESS:
			return addOpportunityIds(state, action);
		default:
			return state;
	}
};

const opportunitiesReducer = combineReducers({
	byId: opportunitiesById,
	allIds: allOpportunities
});

export default opportunitiesReducer;

export const getOpportunityIds = (state) => state.allIds || [];

export const getOpportunity = (state, id) => state.byId[id] || {};
