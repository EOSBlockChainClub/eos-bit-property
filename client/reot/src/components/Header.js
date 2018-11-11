import React from 'react';
import { Image, Icon, Header as H } from 'semantic-ui-react';
import logo from '../assets/images/symbol-white.svg';

export default function Header({ onOpenMenu }) {
	return (
		<header className="bc-header cf">
			<button className="action action--open" aria-label="Open Menu" onClick={onOpenMenu}>
				<Icon name="sidebar" />
			</button>
			<div className="bc-logo">
				<Image src={logo} alt="logo" />
				<span>BitProperty</span>
			</div>
		</header>
	);
}
