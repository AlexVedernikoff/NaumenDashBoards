// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {filterInSingleObject} from 'helpers/marker';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {params, showSingleObject, singleObject, staticGroups, timeUpdate, trails} = geolocation;
	const {groupingMethodName} = params;
	const points = (showSingleObject && singleObject) ? filterInSingleObject(singleObject, staticGroups, groupingMethodName) : trails;

	return {
		points,
		timeUpdate,
		showSingleObject,
		singleObject
	};
};

export {
	props
};
