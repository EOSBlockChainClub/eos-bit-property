import React from 'react';
import { Segment, Menu, Icon, Button } from 'semantic-ui-react';
import { Link, NavLink, withRouter } from 'react-router-dom';

const TopNavigation = ({ history, location }) => (
	<Segment inverted className="app-header">
		<Menu inverted secondary>
			<Menu.Item style={{ marginRight: '5.0em' }} as={Link} to="/">
				<Icon name="home" />
				BitProperty
			</Menu.Item>
			<Menu.Item as={NavLink} to="/registrations">
				My Registrations
			</Menu.Item>
			<Menu.Item position="right">
				<Button
					icon
					labelPosition="left"
					primary
					basic
					style={{ marginRight: '2rem' }}
					disabled={location.pathname === '/register' ? true : false}
					onClick={() => history.push('/register')}
				>
					<Icon name="add" />
					Register a Property
				</Button>
			</Menu.Item>
		</Menu>
	</Segment>
);

export default withRouter(TopNavigation);
