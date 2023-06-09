// @flow
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'iframe-resizer';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from 'containers/App';
import {Provider} from 'react-redux';
import React from 'react';
import configureStore from 'store';
import initializeJsApi from 'utils/api';
import {render} from 'react-dom';

initializeJsApi();

const root = document.getElementById('root');

if (root) {
	const store = configureStore();

	const checkHeight = window.setInterval(function () {
		if (window.frameElement && window.frameElement.height) {
			window.frameElement.setAttribute('style', `height:${window.frameElement.height}px`);
				clearInterval(checkHeight);
		}
	}, 10);

	render(
		<Provider store={store}>
			<App />
		</Provider>,
		root
	);
}
