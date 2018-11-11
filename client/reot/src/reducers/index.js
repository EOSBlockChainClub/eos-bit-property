import { combineReducers } from 'redux';
import news, * as fromNews from './news';
import market, * as fromMarket from './market';
import investments, * as fromInvestments from './investments';
import opportunities, * as fromOpportunities from './opportunities';

const bitproperty = combineReducers({
	news,
	market,
	investments,
	opportunities
});

export default bitproperty;

/* selectors */
export const getNews = (state) => fromNews.getNews(state.news);
export const getMarket = (state) => fromMarket.getMarket(state.market);

export const getInvestmentIds = (state) => fromInvestments.getInvestmentIds(state.investments);

export const getInvestments = (state) => {
	const ids = fromInvestments.getInvestmentIds(state.investments);
	return ids.map((id) => fromInvestments.getInvestment(state.investments, id));
};

export const getOpportunities = (state) => {
	const ids = fromOpportunities.getOpportunityIds(state.opportunities);
	return ids.map((id) => fromOpportunities.getOpportunity(state.opportunities, id));
};
