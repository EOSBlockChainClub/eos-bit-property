import React from 'react';
import { Header } from 'semantic-ui-react';

const change = (value) => {
	if (value > 0) return 'positive';
	else if (value < 0) return 'negative';
	else return 'neutral';
};

export default ({ price, percentChange }) => {
	const movement = change(percentChange);
	const color = movement === 'positive' ? 'green' : movement === 'negative' ? 'red' : '';
	const icon = movement === 'positive' ? 'icon-up' : movement === 'negative' ? 'icon-down' : '';

	price = price.toLocaleString();
	percentChange = Math.abs(percentChange);
	return (
		<div>
			<Header icon={{ className: 'icon-symbol-dark' }} content={`1 = $${price}`} floated="left" />
			<Header color={color} icon={{ className: icon }} content={`${percentChange}%`} floated="right" />
		</div>
	);
};
