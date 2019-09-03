// @flow
import 'babel-polyfill';
import App from 'components/App';
import {configureStore} from 'store';
import {MemoryRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';

const root = document.getElementById('root');

if (root) {
	const store = configureStore();

	const renderApp = () => (
		<Provider store={store}>
			<MemoryRouter>
				<App />
			</MemoryRouter>
		</Provider>
	);

	render(renderApp(), root);

	if (module.hot) {
		module.hot.accept('components/App', () => {
			require('components/App');
			render(renderApp(), root)
		})
	}
}
