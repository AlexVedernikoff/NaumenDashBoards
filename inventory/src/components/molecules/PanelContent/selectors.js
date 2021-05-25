// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {showSinglePoint} = geolocation;

	return {
		showSinglePoint
	};
};

const functions: ConnectedFunctions = {
};

export {
	functions,
	props
};
