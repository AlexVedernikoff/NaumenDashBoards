// @flow
import 'dom4';
import 'whatwg-fetch';
import 'iframe-resizer';
import App from 'components/App';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';
import {root, store} from './constants';
import {setHeight} from 'helpers';

if (root) {
	window.addEventListener('resize', setHeight);
	window.setTimeout(setHeight, 1500);

	const renderApp = () => (
		<Provider store={store}>
			<App />
		</Provider>
	);

	render(renderApp(), root);
}
