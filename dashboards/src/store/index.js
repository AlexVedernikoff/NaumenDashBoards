// @flow
import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import createRootReducer from './reducer';
import type {History} from 'history';
import {routerMiddleware} from 'connected-react-router';
import thunk from 'redux-thunk';

export const configureStore = (history: History) => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk, routerMiddleware(history)];

	if (environment === 'development') {
		middleware.push(createLogger());
	}

	return createStore(createRootReducer(history), applyMiddleware(...middleware));
};
