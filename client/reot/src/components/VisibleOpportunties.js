import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import { getOpportunities } from '../reducers';
import OpportunitiesList from './OpportunitiesList';

class Opportunities extends Component {
	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		const { fetchOpportunities } = this.props;
		fetchOpportunities();
	}

	render() {
		const { opportunities } = this.props;
		return <OpportunitiesList opportunities={opportunities} />;
	}
}

const mapStateToProps = (state) => ({
	opportunities: getOpportunities(state)
});

Opportunities = withRouter(connect(mapStateToProps, actions)(Opportunities));

export default Opportunities;
