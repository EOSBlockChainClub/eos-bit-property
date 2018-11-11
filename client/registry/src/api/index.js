import axios from 'axios';

const eosAccount = 'psychedelica';

export const register = (data) => {
	console.log('api.resgister data = ', data);
	return axios
		.post(`/api/accounts/${eosAccount}/registrations`, {
			account: 'psychedelica',
			registrationId: data.registrationId,
			title: data.title,
			value: data.value,
			address: data.address,
			description: data.description,
			photo: data.photo
		})
		.then(({ data }) => data);
};

/* Registrations for an account */
export const fetchRegistrations = () => axios.get(`/api/accounts/${eosAccount}/registrations`).then(({ data }) => data);
