// @flow
import App from 'components/App';
import {Provider} from 'react-redux';
import React from 'react';
import configureStore from 'store';
import {render} from 'react-dom';

const root = document.getElementById('root');

if (root) {
	const store = configureStore();

	render(
		<Provider store={store}>
			<App />
		</Provider>,
		root
	);
}
