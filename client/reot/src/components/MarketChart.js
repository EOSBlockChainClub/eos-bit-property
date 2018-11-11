import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import Chart from './Chart';

export default class MarketChart extends Component {
	panes = [
		{ menuItem: '1 day', render: () => this.renderTab('1d') },
		{ menuItem: '5 days', render: () => this.renderTab('5d') },
		{ menuItem: '1 month', render: () => this.renderTab('1M') },
		{ menuItem: '1 year', render: () => this.renderTab('1Y') }
	];

	renderTab = (period) => <Tab.Pane attached={false}>{this.renderChart(period)}</Tab.Pane>;

	renderChart = (period) => {
		const { market } = this.props;
		const { data } = market;
		return <Chart data={data} period={period} />;
	};

	handleChange = (e, { activeIndex }) => {
		const { onPeriodSelect } = this.props;
		onPeriodSelect('1Y');
	};

	render() {
		return <Tab menu={{ secondary: true, pointing: true }} panes={this.panes} onTabChange={this.handleChange} />;
	}
}
