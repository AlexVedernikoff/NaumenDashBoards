// @flow
import '@babel/polyfill';
import 'dom4';
import 'whatwg-fetch';
import 'iframe-resizer';
import './fakeApi';
import App from 'components/App';
import {decorateRestCallModule} from './helpers';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';
import {root, store} from './app.constants';
import smoothscroll from 'smoothscroll-polyfill';

top.injectJsApi && top.injectJsApi(top, window);
smoothscroll.polyfill();
decorateRestCallModule(window.jsApi.restCallModule);

if (root) {
	const renderApp = () => (
		<Provider store={store}>
			<App />
		</Provider>
	);

	render(renderApp(), root);
}
