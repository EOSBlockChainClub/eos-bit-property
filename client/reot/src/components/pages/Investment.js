import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import PageHeader from '../PageHeader';
import InvestmentHeader from '../InvestmentHeader';

import TransactionsCard from '../TransactionsCard';

import * as actions from '../../actions';
import { getInvestment } from '../../reducers';

class Investment extends Component {
	componentDidMount() {
		this.fetchData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.id !== prevProps.id) {
			this.fetchData();
		}
	}

	fetchData() {
		const { fetchInvestment, id } = this.props;
		fetchInvestment(id);
	}

	render() {
		const { id, investment } = this.props;
		return (
			<div>
				<PageHeader>
					<InvestmentHeader investment={investment} />
				</PageHeader>
				<Grid padded>
					<Grid.Column>
						<TransactionsCard />
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = (state, { match: { params: { id } } }) => ({
	id,
	investment: getInvestment(state, id)
});

Investment = connect(mapStateToProps, actions)(Investment);

export default Investment;
