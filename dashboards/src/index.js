// @flow
import 'babel-polyfill';
import './iframeResizer';
import './fakeApi';
import App from 'components/App';
import {configureStore} from 'store';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';
import smoothscroll from 'smoothscroll-polyfill';
import Startup from 'containers/Startup/Startup';

top.injectJsApi && top.injectJsApi(top, window);
smoothscroll.polyfill();

export const root = document.getElementById('root');
export const store = configureStore();

if (root) {
	const renderApp = () => (
		<Provider store={store}>
			<Startup>
					<App />
			</Startup>
		</Provider>
	);

	render(renderApp(), root);
}
