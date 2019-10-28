// @flow
import 'babel-polyfill';
import App from 'components/App';
import {configureStore} from 'store';
import {ConnectedRouter} from 'connected-react-router';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';
import smoothscroll from 'smoothscroll-polyfill';
import Startup from 'containers/Startup/Startup';

smoothscroll.polyfill();

export const root = document.getElementById('root');
export const history = createMemoryHistory();
export const store = configureStore(history);

if (root) {
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
}
