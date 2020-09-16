// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import type {DynamicPoint, StaticGroup, StaticPoint} from 'types/point';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicPoints, params} = geolocation;

	return {
		dynamicPoints,
		params
	};
};

const functions: ConnectedFunctions = {
};

export {
	functions,
	props
};
