import React from 'react';
import { Statistic, Icon, Image, Grid, Header } from 'semantic-ui-react';
import symbol from '../assets/images/symbol-purple.svg';

export default ({ balance, totalValue = '', tokenValue }) => {
	return (
		<Grid columns="equal" verticalAlign="middle">
			<Grid.Column tablet={16} computer={4}>
				<Statistic size="mini" color="purple">
					<Statistic.Label>Tokens</Statistic.Label>
					<Statistic.Value>{balance}</Statistic.Value>
				</Statistic>
			</Grid.Column>
			<Grid.Column tablet={16} computer={12}>
				<Grid columns="equal" textAlign="center">
					<Grid.Column>
						<Statistic size="mini" text>
							<Statistic.Label>USD</Statistic.Label>
							<Statistic.Value>${totalValue.toLocaleString()}</Statistic.Value>
						</Statistic>
					</Grid.Column>
					<Grid.Column>
						<Statistic size="mini" text>
							<Statistic.Value>
								<Header
									size="tiny"
									icon={{ className: 'icon-symbol-dark' }}
									content={`1 = $${tokenValue}`}
									floated="left"
								/>
							</Statistic.Value>
						</Statistic>
					</Grid.Column>
				</Grid>
			</Grid.Column>
		</Grid>
	);
};
