// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchGeolocation, reloadGeolocation, toggleFilter, togglePanel} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {updatePointsMode, groupingMethodName} = state.geolocation.params;

	return {
		filterActive: true,
		filterOpen: state.geolocation.controls.filterOpen,
		filterShow: groupingMethodName === 'groupingMethodName',
		panelOpen: state.geolocation.controls.panelOpen,
		updatePointsMode
	};
};

const functions: ConnectedFunctions = {
	fetchGeolocation,
	reloadGeolocation,
	toggleFilter,
	togglePanel
};

export {
	functions,
	props
};
