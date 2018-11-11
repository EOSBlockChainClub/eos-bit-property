import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from './IconButton';

export default function Trade({ investment }) {
	return (
		<Link to={`/investments/${investment.id}/trade`}>
			<IconButton icon="icon-buy" content="Trade" primary />
		</Link>
	);
}
