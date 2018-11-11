import React from 'react';
import { Card } from 'semantic-ui-react';
import Market from './Market';

export default () => {
	return (
		<Card fluid>
			<Card.Content header="Market" />
			<Card.Content description={<Market />} />
		</Card>
	);
};
