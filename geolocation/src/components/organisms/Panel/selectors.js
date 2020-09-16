// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

const props = (state: AppState): ConnectedProps => {
	return {
		open: state.geolocation.controls.panelOpen
	};
};

const functions: ConnectedFunctions = {};

export {
	functions,
	props
};
