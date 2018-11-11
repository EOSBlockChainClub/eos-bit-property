import { FETCH_MARKET_SUCCESS, FETCH_MARKET_FAILURE } from '../types';

export default function news(state = {}, action) {
	switch (action.type) {
		case FETCH_MARKET_SUCCESS:
			return { ...action.response };
		case FETCH_MARKET_FAILURE:
			return {};
		default:
			return state;
	}
}

export const getMarket = (state) => state;
