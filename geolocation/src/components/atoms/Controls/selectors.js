// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {reloadGeolocation} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	return ({
	});
};

const functions: ConnectedFunctions = {
	reloadGeolocation
};

export {
	functions,
	props
};
