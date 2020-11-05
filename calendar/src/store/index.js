// @flow
import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

const configureStore = () => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk];

	if (environment === 'development') {
		middleware.push(createLogger());
	}

	const store = createStore(
		rootReducer,
		applyMiddleware(...middleware)
	);

	return store;
};

export default configureStore;
