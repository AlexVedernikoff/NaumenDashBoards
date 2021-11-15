// @flow
import 'dom4';
import 'whatwg-fetch';
import App from 'components/App';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';
import {root, store} from './app.constants';
import smoothscroll from 'smoothscroll-polyfill';
import TranslationProvider from 'components/templates/TranslationProvider';

smoothscroll.polyfill();

if (root) {
	const renderApp = () => (
		<TranslationProvider>
			<Provider store={store}>
				<App />
			</Provider>
		</TranslationProvider>
	);

	render(renderApp(), root);
}
