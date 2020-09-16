// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import type {DynamicPoint, StaticGroup, StaticPoint} from 'types/point';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicPoints, panelShow, params, staticGroups, staticPoints} = geolocation;
	const pointsShow = (panelShow === 'dynamic') ? [...dynamicPoints] : [...staticPoints];

	return {
		params,
		panelShow,
		pointsShow,
		staticGroups
	};
};

const functions: ConnectedFunctions = {
};

export {
	functions,
	props
};
