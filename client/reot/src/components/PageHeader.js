import React from 'react';

export default ({ children }) => {
	return (
		<div className="bc-header__main">
			<div className="bc-header__title"> {children} </div>
		</div>
	);
};
