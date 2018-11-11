import React, { Component } from 'react';
import { Header, Container, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getRegistrations } from '../../reducers';
import * as actions from '../../actions';

class Registerations extends Component {
	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		this.props.fetchRegistrations();
	}

	renderRows = (registrations = []) => {
		const length = registrations.length;
		return length === 0 ? (
			<Table.Row key={1}>
				<Table.Cell>No records found</Table.Cell>
			</Table.Row>
		) : (
			registrations.map((reg) => {
				const { nftId, registrationId, title, value, description, address } = reg;
				return (
					<Table.Row key={nftId}>
						<Table.Cell>
							<Header size="small" color="blue">
								{nftId}
							</Header>
						</Table.Cell>
						<Table.Cell>{registrationId}</Table.Cell>
						<Table.Cell>{title}</Table.Cell>
						<Table.Cell>{address}</Table.Cell>
						<Table.Cell>{value}</Table.Cell>
					</Table.Row>
				);
			})
		);
	};

	render() {
		const { registrations } = this.props;
		return (
			<Container>
				<Header
					as="h3"
					content="My Registered Properties"
					textAlign="center"
					attached="top"
					block
					className="table-title"
				/>
				<Table celled attached selectable>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>NFT ID</Table.HeaderCell>
							<Table.HeaderCell>Reg ID</Table.HeaderCell>
							<Table.HeaderCell>Title</Table.HeaderCell>
							<Table.HeaderCell>Address</Table.HeaderCell>
							<Table.HeaderCell>Market Value</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>{this.renderRows(registrations)}</Table.Body>
				</Table>
			</Container>
		);
	}
}

function mapStateToProps(state) {
	return {
		registrations: getRegistrations(state)
	};
}

export default connect(mapStateToProps, actions)(Registerations);
