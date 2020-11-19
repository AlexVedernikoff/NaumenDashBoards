// @flow
import 'iframe-resizer';
import App from 'components/App';
import {Provider} from 'react-redux';
import React from 'react';
import configureStore from 'store';
import initializeJsApi from 'utils/api';
import {render} from 'react-dom';

initializeJsApi();

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
