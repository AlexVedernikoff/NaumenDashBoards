// @flow
import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import root from './reducer';
import thunk from 'redux-thunk';

export const configureStore = () => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk];

	if (environment === 'development') {
		middleware.push(createLogger());
	}

	return createStore(root, applyMiddleware(...middleware));
};
