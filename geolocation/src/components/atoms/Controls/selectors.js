// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {reloadGeolocation} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {dynamicMarkers} = state.geolocation;
	const dynamicMarkersUuids = Object.keys(dynamicMarkers).join(',');

	return ({
		dynamicMarkersUuids
	});
};

const functions: ConnectedFunctions = {
	reloadGeolocation
};

export {
	functions,
	props
};
