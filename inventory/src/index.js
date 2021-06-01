// @flow
import 'babel-polyfill';
import configureStore from 'store';
import Geolocation from 'containers/Geolocation';
import {injectJsApi} from 'utils/api/context';
import {Provider} from 'react-redux';
import React from 'react';
import {render} from 'react-dom';
import Startup from 'containers/Startup';

const root = document.getElementById('root');

if (process.env.NODE_ENV !== 'development') {
	injectJsApi();
}

const store = configureStore();

render(
	<Provider store={store}>
		<Startup>
			<Geolocation />
		</Startup>
	</Provider>,
	root
);
