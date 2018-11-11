import { combineReducers } from 'redux';
import registrations, * as fromRegistrations from './registrations';

const bitpropertyApp = combineReducers({
	registrations
});

export default bitpropertyApp;

/* selectors */
export const getRegistrations = (state) => fromRegistrations.getRegistrations(state.registrations);
