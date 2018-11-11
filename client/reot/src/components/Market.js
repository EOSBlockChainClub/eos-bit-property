import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { getMarket } from '../reducers';
import MarketViewer from './MarketViewer';

class Market extends Component {
	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		const { fetchMarket } = this.props;
		fetchMarket('1D'); //default
	}

	render() {
		const { market, fetchMarket } = this.props;
		return <MarketViewer data={market} onPeriodSelect={fetchMarket} />;
	}
}

const mapStateToProps = (state) => ({
	market: getMarket(state)
});

Market = connect(mapStateToProps, actions)(Market);

export default Market;
