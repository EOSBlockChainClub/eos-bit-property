import React from 'react';
import { Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
export default function MenuItem({ text, to, icon, ...rest }) {
	return (
		<NavLink exact className={`menu__item`} role="menuitem" to={to} {...rest}>
			<div className="menu__link truncate">
				<Image src={icon} avatar />
				<span>{text}</span>
			</div>
		</NavLink>
	);
}
