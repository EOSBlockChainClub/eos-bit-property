import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import Registrations from '../pages/Registrations';

const Routes = () => (
	<Switch>
		{/* <Route path="/" exact component={Home} /> */}
		<Redirect exact from="/" to="/registrations" />
		<Route path="/register" exact component={Register} />
		<Route path="/registrations" exact component={Registrations} />
		{/* Finally, catch all unmatched routes */}
		<Route component={NotFound} />
	</Switch>
);

export default Routes;
