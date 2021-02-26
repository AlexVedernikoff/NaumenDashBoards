// @flow
import {applyMiddleware, compose, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

export const configureStore = () => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk];
	let composeEnhancers = compose;

	if (environment === 'development') {
		middleware.push(createLogger());

		if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
			composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
		}
	}

	return createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));
};
