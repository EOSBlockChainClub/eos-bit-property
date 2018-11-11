import React from 'react';
import { Card } from 'semantic-ui-react';
import VisibleOpportunties from './VisibleOpportunties';

export default () => {
	return (
		<Card fluid>
			<Card.Content header="Opportunities" />
			<Card.Content description={<VisibleOpportunties />} />
		</Card>
	);
};
