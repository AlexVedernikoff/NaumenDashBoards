// @flow
import 'babel-polyfill';
import App from 'containers/App';
import configureStore from './store';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';

const root = document.getElementById('root');

if (root) {
	const store = configureStore();

	const renderApp = () => (
		<Provider store={store}>
			<App />
		</Provider>
	);

	render(renderApp(), root);
}
