import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TopNavigation from './components/navigation/TopNavigation';
import Routes from './components/routes';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="app">
				<TopNavigation />
				<div className="app-body">
					<Routes />
				</div>
			</div>
		);
	}
}

//have to use withRouter here. See https://reacttraining.com/react-router/web/guides/redux-integration
export default withRouter(App);
