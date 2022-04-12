// @flow
import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

export const configureStore = () => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk];
	let composeEnhancers = compose;

	if (environment === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
		composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true, traceLimit: 25});
	}

	return createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));
};
