// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setTab} from 'store/geolocation/actions';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {panelShow, params} = geolocation;
	const {dynamicPointsListName, staticPointsListName} = params;

	return {
		dynamicPointsListName,
		panelShow,
		staticPointsListName
	};
};

const functions: ConnectedFunctions = {
	setTab
};

export {
	functions,
	props
};
