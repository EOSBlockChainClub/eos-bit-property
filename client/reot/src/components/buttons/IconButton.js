import React from 'react';
import { Button } from 'semantic-ui-react';

export default function IconButton({ icon, ...rest }) {
	return <Button labelPosition="left" icon={{ className: icon }} {...rest} />;
}
