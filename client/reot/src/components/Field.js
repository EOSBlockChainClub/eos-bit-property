import React from 'react';
import { Header } from 'semantic-ui-react';

export default function Field({ label, value }) {
	return <Header size="tiny" content={label} subheader={value} />;
}
