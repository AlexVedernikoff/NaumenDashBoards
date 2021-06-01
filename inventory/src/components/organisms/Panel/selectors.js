// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

const props = (state: AppState): ConnectedProps => {
	return {
		open: state.geolocation.controls.panelOpen,
		showSingleObject: state.geolocation.showSingleObject,
		singleObject: state.geolocation.singleObject
	};
};

const functions: ConnectedFunctions = {};

export {
	functions,
	props
};
