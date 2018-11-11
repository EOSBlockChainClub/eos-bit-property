import React, { Component } from 'react';
import { Container, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as api from '../../api';

class Register extends Component {
	state = {
		loading: false,
		registrationId: '',
		title: '',
		value: '',
		address: '',
		description: '',
		photo: ''
	};

	onInputChange = (e) =>
		this.setState({
			[e.target.name]: e.target.value
		});

	onSubmit = () => {
		this.setState({ loading: true });
		api.register({ ...this.state }).then(
			(response) => {
				console.log('resgistration succesful');
				this.setState({ loading: false });
				this.props.history.push('/registrations');
			},
			(error) => {
				console.log('some error in registration ', error);
				this.setState({ loading: false });
			}
		);
	};

	render() {
		const { loading, registrationId, title, value, description, address, photo } = this.state;
		return (
			<Container text>
				<Form>
					<Form.Input
						fluid
						label="Property Registration ID"
						value={registrationId}
						name="registrationId"
						onChange={this.onInputChange}
					/>
					<Form.Input fluid label="Title" value={title} name="title" onChange={this.onInputChange} />
					<Form.TextArea
						label="Description"
						value={description}
						name="description"
						onChange={this.onInputChange}
					/>
					<Form.Input fluid label="Address" value={address} name="address" onChange={this.onInputChange} />
					<Form.Input fluid label="Value" value={value} name="value" onChange={this.onInputChange} />
					<Form.Input fluid label="Photo" value={photo} name="photo" onChange={this.onInputChange} />
					<p style={{ textAlign: 'center' }}>
						<Button loading={loading} primary onClick={() => this.onSubmit()}>
							Submit
						</Button>
					</p>
				</Form>
			</Container>
		);
	}
}

export default withRouter(Register);
