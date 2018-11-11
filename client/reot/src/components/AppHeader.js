import React, { Component } from 'react';
import Header from './Header';
import Nav from './Nav';

export default class AppHeader extends Component {
	state = {
		menuOpen: false
	};

	onOpenMenu = () => this.setState({ menuOpen: true });
	onCloseMenu = () => this.setState({ menuOpen: false });

	render() {
		const { menuOpen } = this.state;
		return (
			<div className="app-header">
				<Header onOpenMenu={this.onOpenMenu} />
				<Nav open={menuOpen} onClose={this.onCloseMenu} />
			</div>
		);
	}
}
