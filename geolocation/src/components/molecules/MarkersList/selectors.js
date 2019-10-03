// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import type {AppState} from 'store/types';

const props = (state: AppState): ConnectedProps => {
	const dataMarkers = {};
	const {dynamicMarkers, staticMarkers} = state.geolocation;
	Object.assign(dataMarkers, dynamicMarkers, staticMarkers);
	return {
		dataMarkers,
		params: state.geolocation.params
	};
};

const functions: ConnectedFunctions = {
};

export {
	functions,
	props
};
