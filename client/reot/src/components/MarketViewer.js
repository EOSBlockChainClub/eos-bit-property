import React, { Component } from 'react';
import { Grid, Tab } from 'semantic-ui-react';
import Ticker from './Ticker';
import LineChart from './LineChart';
import moment from 'moment';

const formatTimestamp = (timestamp, period) => {
	const time = moment(timestamp);
	switch (period) {
		case '1D':
			return time.format('h:mm A');
		case '5D':
			return time.format('DD MMM');
		case '1M':
			return time.format('DD MMM');
		case '1Y':
			return time.format('MMM YY');
		default:
			return time.format('DD MMM YY');
	}
};

const formatter = (period) => (date) => formatTimestamp(date, period);

export default class MarketViewer extends Component {
	panes = [
		{ _id: '1D', menuItem: '1 day', render: () => this.renderTabContent('1D') },
		{ _id: '5D', menuItem: '5 days', render: () => this.renderTabContent('5D') },
		{ _id: '1M', menuItem: '1 month', render: () => this.renderTabContent('1M') },
		{ _id: '1Y', menuItem: '1 year', render: () => this.renderTabContent('1Y') }
	];

	onTabChange = (e, { activeIndex }) => {
		const { onPeriodSelect } = this.props;
		const { _id } = this.panes[activeIndex];
		onPeriodSelect(_id);
	};

	renderTabContent = (period) => {
		const { data: { data } } = this.props;
		return (
			<Tab.Pane attached={false}>
				{<LineChart data={data} tickFormatter={formatter(period)} labelFormatter={formatter(period)} />}
			</Tab.Pane>
		);
	};

	render() {
		const { data: { price, percentChange } } = this.props;
		return (
			<Grid>
				{/* <Grid.Row>
					<Grid.Column>{price && <Ticker price={price} percentChange={percentChange} />}</Grid.Column>
				</Grid.Row> */}
				<Grid.Row>
					<Grid.Column>
						<Tab
							menu={{ secondary: true, pointing: true }}
							panes={this.panes}
							onTabChange={this.onTabChange}
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}
