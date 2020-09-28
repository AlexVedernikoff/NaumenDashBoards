// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {resetAllGroups, selectAllGroups} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {controls, staticGroups} = geolocation;

	return {
		open: controls.filterOpen,
		staticGroups
	};
};

const functions: ConnectedFunctions = {
	resetAllGroups,
	selectAllGroups
};

export {
	functions,
	props
};
