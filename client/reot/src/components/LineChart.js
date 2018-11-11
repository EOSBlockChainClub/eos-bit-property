import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default ({ data, tickFormatter, labelFormatter }) => {
	return (
		<ResponsiveContainer width="100%" height={250}>
			<LineChart data={data}>
				<XAxis dataKey="time" tickFormatter={tickFormatter} domain={[ 'auto', 'auto' ]} />
				<YAxis />
				<Tooltip labelFormatter={labelFormatter} />
				<Line dataKey="value" type="monotone" stroke="#703DD3" strokeWidth={2} />
			</LineChart>
		</ResponsiveContainer>
	);
};
