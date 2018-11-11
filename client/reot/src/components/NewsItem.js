import React from 'react';
import { Header } from 'semantic-ui-react';

export default ({ title, description, onClick }) => {
	return (
		<div>
			<Header className="clickable" size="tiny" color="purple" onClick={onClick}>
				{title}
			</Header>
			<div> {description}</div>
		</div>
	);
};
