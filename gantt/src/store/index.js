// @flow
import {applyMiddleware, compose, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import root from './reducer';
import thunk from 'redux-thunk';

const configureStore = () => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk];

	if (environment === 'development') {
		middleware.push(createLogger());
	}

	const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	return createStore(root, composeEnhancer(applyMiddleware(...middleware)));
};

export default configureStore;
