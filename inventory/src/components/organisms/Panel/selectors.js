// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

const props = (state: AppState): ConnectedProps => {
	return {
		open: state.geolocation.controls.panelOpen,
		showSinglePoint: state.geolocation.showSinglePoint,
		singlePoint: state.geolocation.singlePoint
	};
};

const functions: ConnectedFunctions = {};

export {
	functions,
	props
};
