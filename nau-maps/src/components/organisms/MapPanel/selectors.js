// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setMapPanel, toggleMapPanel} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => ({
	mapSelect: state.geolocation.mapSelect,
	mapsKeyList: state.geolocation.mapsKeyList,
	panelMapOpen: state.geolocation.controls.panelMapOpen
});

const functions: ConnectedFunctions = {
	setMapPanel,
	toggleMapPanel
};

export {
	functions,
	props
};
