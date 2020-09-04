// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

const props = (state: AppState): ConnectedProps => {
	return {
		open: state.geolocation.controls.filterOpen
	}
};

const functions: ConnectedFunctions = {};

export {
	functions,
	props
};
