import React from 'react';
import { Card } from 'semantic-ui-react';
import News from './News';

export default () => {
	return (
		<Card fluid>
			<Card.Content header="News" />
			<Card.Content description={<News />} />
		</Card>
	);
};
