// @flow
import 'babel-polyfill';
import App from 'components/App';
import {configureStore} from 'store';
import {ConnectedRouter} from 'connected-react-router';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';
import Startup from 'containers/Startup/Startup';

const root = document.getElementById('root');
export const history = createMemoryHistory();

if (root) {
	const store = configureStore(history);

	const renderApp = () => (
		<Provider store={store}>
			<Startup>
				<ConnectedRouter history={history}>
					<App />
				</ConnectedRouter>
			</Startup>
		</Provider>
	);

	render(renderApp(), root);

	if (module.hot) {
		module.hot.accept('components/App', () => {
			require('components/App');
			render(renderApp(), root);
		});
	}
}
