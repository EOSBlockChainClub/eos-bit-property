import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import bitproperty from './reducers';

const configureStore = () => {
	const middlewares = [ thunk ];

	return createStore(
		bitproperty,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
		applyMiddleware(...middlewares)
	);
};

export default configureStore;
