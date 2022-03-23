// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchGeolocation, toggleMapPanel, zoomIn, zoomOut} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => ({
	panelOpen: state.geolocation.controls.panelOpen
});

const functions: ConnectedFunctions = {
	fetchGeolocation,
	toggleMapPanel,
	zoomIn,
	zoomOut
};

export {
	functions,
	props
};
