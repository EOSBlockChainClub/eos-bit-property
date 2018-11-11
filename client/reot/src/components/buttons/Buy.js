import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from './IconButton';

export default function Buy({ investment }) {
	return (
		<Link to={`/investments/${investment.id}/buy`}>
			<IconButton icon="icon-buy" content="Buy" primary />
		</Link>
	);
}
