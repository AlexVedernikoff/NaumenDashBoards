// @flow
import {applyMiddleware, createStore} from 'redux';
import {batchDispatchMiddleware} from 'redux-batched-actions';
import {createLogger} from 'redux-logger';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

export const configureStore = () => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk, batchDispatchMiddleware];

	if (environment === 'development') {
		middleware.push(createLogger());
	}

	return createStore(rootReducer, applyMiddleware(...middleware));
};
