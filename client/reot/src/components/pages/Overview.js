import React, { Component } from 'react';
import { Header, Grid } from 'semantic-ui-react';

import PageHeader from '../PageHeader';
import InvestmentCard from '../InvestmentCard';
import MarketCard from '../MarketCard';
import NewsCard from '../NewsCard';

import { connect } from 'react-redux';
import { getInvestments } from '../../reducers';

class Overview extends Component {
	render() {
		const { investments } = this.props;
		return (
			<div>
				<PageHeader>
					<Grid>
						<Grid.Column verticalAlign="middle" mobile={16} tablet={8} computer={8}>
							<Header as="h2" color="purple" floated="left">
								Your Investments
							</Header>
						</Grid.Column>
					</Grid>
				</PageHeader>
				<Grid padded>
					<Grid.Column mobile={16} tablet={16} computer={9}>
						{investments.map((inv) => <InvestmentCard key={inv.id} investment={inv} />)}
					</Grid.Column>
					<Grid.Column mobile={16} tablet={16} computer={7}>
						<MarketCard />
						<NewsCard />
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	investments: getInvestments(state)
});

Overview = connect(mapStateToProps)(Overview);

export default Overview;
