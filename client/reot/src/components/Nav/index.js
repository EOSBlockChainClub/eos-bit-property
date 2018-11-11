import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter, matchPath } from 'react-router-dom';

import MenuItem from './MenuItem';
import { getInvestments } from '../../reducers';
import home from '../../assets/images/icons/home.svg';
import bullet from '../../assets/images/icons/bullet.svg';
import back from '../../assets/images/icons/back.svg';
import symbol from '../../assets/images/icons/symbol.svg';
import './Nav.css';

class Nav extends Component {
	renderHomeLinks = (investments) => (
		<div>
			<MenuItem text="Account" to="/" icon={home} />
			{/* {investments.map((i) => <MenuItem key={i.id} text={i.token} to={`/investments/${i.id}`} icon={bullet} />)} */}
			<MenuItem text="Investment Opportunities" to="/opportunities" icon={symbol} />
		</div>
	);

	render() {
		const { open, onClose, investments } = this.props;
		console.log(investments);

		return (
			<nav id="ml-menu" className={`app-menu ${open ? 'menu--open' : ''}`}>
				<button className="action action--close" aria-label="Close Menu" onClick={onClose}>
					<Icon name="close" />
				</button>
				<div className="menu__wrap">
					<ul role="menu" className="menu__category">
						{this.renderHomeLinks(investments)}
					</ul>
				</div>
			</nav>
		);
	}
}

const mapStateToProps = (state) => ({
	investments: getInvestments(state)
});

Nav = connect(mapStateToProps)(Nav);

export default withRouter(Nav);
