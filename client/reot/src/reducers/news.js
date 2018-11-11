import { FETCH_NEWS_SUCCESS, FETCH_NEWS_FAILURE } from '../types';

export default function news(state = [], action) {
	switch (action.type) {
		case FETCH_NEWS_SUCCESS:
			return [ ...action.response ];
		case FETCH_NEWS_FAILURE:
			return [];
		default:
			return state;
	}
}

export const getNews = (state) => state;
