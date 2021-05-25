// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchGeolocation, reloadGeolocation, toggleFilter, togglePanel} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {controls, loading, staticGroups} = geolocation;
	const {groupingMethodName, updatePointsMode} = geolocation.params;
	const filterShow = !!(groupingMethodName && staticGroups.length);

	return {
		filterActive: staticGroups.some(item => !item.checked),
		filterOpen: controls.filterOpen,
		filterShow: loading ? true : filterShow,
		panelOpen: controls.panelOpen,
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
