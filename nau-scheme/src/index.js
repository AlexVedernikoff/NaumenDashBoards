// @flow
import 'dom4';
import 'whatwg-fetch';
import 'iframe-resizer';
import App from 'components/App';
import {container, store} from './constants';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import React from 'react';

if (container) {
	const renderApp = () => (
		<Provider store={store}>
			<App />
		</Provider>
	);

	const root = createRoot(container);
	root.render(renderApp());
}
