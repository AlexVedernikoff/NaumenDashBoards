// @flow
import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import root from 'reducers';
import type {State} from 'types';
import thunk from 'redux-thunk';

export const configureStore = (initialState: State) => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk];

	if (environment === 'development') {
		middleware.push(createLogger());
	}

	const store = createStore(root, initialState, applyMiddleware(...middleware));

	if (module && module.hot) {
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers');
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
};

export default configureStore;
