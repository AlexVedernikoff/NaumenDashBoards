// @flow
import 'babel-polyfill';
import 'dom4';
import 'whatwg-fetch';
import './iframeResizer';
import './fakeApi';
import App from 'components/App';
import {configureStore} from 'store';
import {fixInitialHeight} from './helpers';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';
import smoothscroll from 'smoothscroll-polyfill';

top.injectJsApi && top.injectJsApi(top, window);
smoothscroll.polyfill();
fixInitialHeight();

export const root = document.getElementById('root');
export const store = configureStore();

if (root) {
	const renderApp = () => (
		<Provider store={store}>
			<App />
		</Provider>
	);

	render(renderApp(), root);
}
