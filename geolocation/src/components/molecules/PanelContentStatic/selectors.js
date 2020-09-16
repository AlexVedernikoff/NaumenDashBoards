// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {params, staticGroups, staticPoints} = geolocation;

	return {
		params,
		staticGroups,
		staticPoints
	};
};

const functions: ConnectedFunctions = {
};

export {
	functions,
	props
};
