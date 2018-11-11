import React, { Component } from 'react';
import InvestmentSummaryRow from './InvestmentSummaryRow';

class InvestmentSummary extends Component {
	render() {
		const { investment } = this.props;
		return <InvestmentSummaryRow {...investment} />;
	}
}

export default InvestmentSummary;
