// @flow
import 'dom4';
import 'whatwg-fetch';
import 'iframe-resizer';
import App from 'components/App';
import {container, store} from 'app.constants';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import React from 'react';

import {setHeight} from 'helpers';

if (container) {
	if (window.frameElement) {
		window.addEventListener('resize', setHeight);
		window.setTimeout(setHeight, 1500);
	}

	const renderApp = () => (
		<Provider store={store}>
			<App />
		</Provider>
	);

	const root = createRoot(container);
	root.render(renderApp());
}
