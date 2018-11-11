import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import BuyButton from './buttons/Buy';

const headerRow = [ 'Token', 'Property', 'Market Value', 'Custodian', '' ];

const renderBodyRow = (onClickToken) => ({ id, token, nftId, marketValue = '', custodian }, i) => ({
	key: id || `row-${i}`,
	cells: [
		{ key: 'id', content: <ID id={token} onClick={onClickToken} /> },
		nftId,
		marketValue.toLocaleString(),
		custodian,
		{ key: 'buy', content: <BuyButton investment={{ id }} /> }
	]
});

const ID = ({ id, onClick }) => (
	<span onClick={() => onClick(id)} style={{ cursor: 'pointer' }}>
		<Icon className="icon-token" style={{ marginRight: '25px' }} />
		<span style={{ color: '#703dd3' }}>{id}</span>
	</span>
);

export default ({ opportunities = [], onClickToken }) => {
	return (
		<Table
			basic="very"
			headerRow={headerRow}
			renderBodyRow={renderBodyRow(onClickToken)}
			tableData={opportunities}
		/>
	);
};
