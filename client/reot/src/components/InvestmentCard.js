import React from 'react';
import { Card } from 'semantic-ui-react';
import InvestmentSummary from './InvestmentSummary';
import TradeButton from './buttons/Trade';

export default ({ investment }) => {
	return (
		<Card fluid>
			<Card.Content header={<div className="header truncate">{investment.token}</div>} />
			<Card.Content description={<InvestmentSummary investment={investment} />} />
			<Card.Content extra>
				<TradeButton investment={investment} />
			</Card.Content>
		</Card>
	);
};
