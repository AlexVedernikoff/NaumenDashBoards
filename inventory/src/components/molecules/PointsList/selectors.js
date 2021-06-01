// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {filterByGroup} from 'helpers/marker';

const props = (state: AppState): ConnectedProps => {
	const {params, staticGroups, timeUpdate, trails} = state.geolocation;
	const {groupingMethodName} = params;
	const points = filterByGroup(trails, staticGroups, groupingMethodName);

	return {
		trails: points,
		timeUpdate
	};
};

export {
	props
};
