// @flow
import type {ConnectedProps} from './types';
import type {AppState} from 'store/types';

const props = (state: AppState): ConnectedProps => {
	const {dynamicPoints, staticPoints} = state.geolocation;

	return {
		dynamicPoints,
		staticPoints
	};
};

export {
	props
};
