// @flow
import type {ConnectedProps} from './types';
import type {AppState} from 'store/types';

const props = (state: AppState): ConnectedProps => {
	const {dynamicMarkers, multipleMarkers, staticMarkers} = state.geolocation;

	return {
		dynamicMarkers,
		multipleMarkers,
		staticMarkers
	};
};

export {
	props
};
