// @flow
import {applyMiddleware, compose, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

const configureStore = () => {
	const environment = process.env.NODE_ENV;
	const middleware = [thunk];

	if (environment === 'development') {
		middleware.push(createLogger());
	}
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	const store = createStore(
		rootReducer,
		composeEnhancers(applyMiddleware(...middleware))
	);

	return store;
};

export default configureStore;
