// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {filterInSingleObject} from 'helpers/marker';

const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {mapObjects, params, searchObjects, searchText, showSingleObject, singleObject, staticGroups, timeUpdate} = geolocation;
	const {groupingMethodName} = params;
	const points = (showSingleObject && singleObject) ? filterInSingleObject(singleObject, staticGroups, groupingMethodName) : mapObjects;

	return {
		points,
		searchObjects,
		searchText,
		showSingleObject,
		singleObject,
		timeUpdate
	};
};

export {
	props
};
