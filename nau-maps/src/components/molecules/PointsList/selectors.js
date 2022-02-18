// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {filterByGroup} from 'helpers/marker';
import {NAME_POINT_TYPE} from 'types/equipment';
import {NAME_TRAIL_TYPE} from 'types/trail';
import {NAME_SECTION_TYPE} from 'types/part';

const props = (state: AppState): ConnectedProps => {
	const {params, staticGroups, timeUpdate, mapObjects} = state.geolocation;
	const {groupingMethodName} = params;
	const points = filterByGroup(mapObjects, staticGroups, groupingMethodName).filter(point => point.geopositions !== null);

	return {
		points: points.filter(point => point.type === NAME_POINT_TYPE),
		sections: points.filter(point => point.type === NAME_SECTION_TYPE),
		trails: points.filter(point => point.type === NAME_TRAIL_TYPE),
		timeUpdate
	};
};

export {
	props
};
