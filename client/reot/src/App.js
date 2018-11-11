import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import './App.css';
import AppHeader from './components/AppHeader';
import Routes from './components/routes';
import * as actions from './actions';

class App extends Component {
	componentDidMount() {
		const { fetchInvestments } = this.props;
		fetchInvestments();
	}

	render() {
		return (
			<div className="app-container">
				<AppHeader />
				<div className="app-content">
					<Routes />
				</div>
			</div>
		);
	}
}

App = connect(null, actions)(App);

export default withRouter(App);
