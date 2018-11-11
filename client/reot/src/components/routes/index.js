import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Opportunities from '../pages/Opportunities';
import NotFound from '../pages/NotFound';
import Overview from '../pages/Overview';

const Routes = () => (
	<Switch>
		<Route path="/" exact component={Overview} />
		<Route path="/opportunities" exact component={Opportunities} />
		{/* Finally, catch all unmatched routes */}
		<Route component={NotFound} />
	</Switch>
);

export default Routes;
