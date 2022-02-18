// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {togglePanel} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	return {
		panelOpen: state.geolocation.controls.panelOpen,
		showSingleObject: state.geolocation.showSingleObject,
		singleObject: state.geolocation.singleObject
	};
};

const functions: ConnectedFunctions = {
	togglePanel
};

export {
	functions,
	props
};
