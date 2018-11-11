import * as api from '../api';

export const fetchRegistrations = () => (dispatch, getState) =>
	api.fetchRegistrations().then(
		(response) => {
			dispatch({
				type: 'FETCH_REGISTRATIONS_SUCCESS',
				response
			});
		},
		(error) => {
			dispatch({
				type: 'FETCH_REGISTRATIONS_FAILURE',
				message: error.message || 'Something went wrong.'
			});
		}
	);
