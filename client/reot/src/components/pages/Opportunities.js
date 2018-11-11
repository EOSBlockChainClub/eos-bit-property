import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Header } from 'semantic-ui-react';

import PageHeader from '../PageHeader';
import OpportunitiesHeader from '../OpportunitiesHeader';
import OpportunitiesCard from '../OpportunitiesCard';

import * as actions from '../../actions';
import { getOpportunities } from '../../reducers';

class Opportunities extends Component {
	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		const { fetchOpportunities } = this.props;
		fetchOpportunities();
	}

	render() {
		const { id, investment } = this.props;
		return (
			<div>
				<PageHeader>
					<Grid>
						<Grid.Column verticalAlign="middle" mobile={16} tablet={8} computer={8}>
							<Header as="h2" color="purple" floated="left">
								Investment Vehicles
							</Header>
						</Grid.Column>
					</Grid>
				</PageHeader>
				<Grid padded>
					<Grid.Column>
						<OpportunitiesCard />
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	opportunities: getOpportunities(state)
});

Opportunities = connect(mapStateToProps, actions)(Opportunities);

export default Opportunities;
