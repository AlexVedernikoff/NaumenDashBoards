// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {filterByGroup} from 'helpers/marker';
import {NAME_POINT_TYPE} from 'types/equipment';
import {NAME_SECTION_TYPE} from 'types/part';
import {NAME_TRAIL_TYPE} from 'types/trail';

const props = (state: AppState): ConnectedProps => {
	const {mapObjects, params, staticGroups, timeUpdate} = state.geolocation;
	const {groupingMethodName} = params;
	const points = filterByGroup(mapObjects, staticGroups, groupingMethodName).filter(point => point.geopositions !== null);

	return {
		points: points.filter(point => point.type === NAME_POINT_TYPE),
		sections: points.filter(point => point.type === NAME_SECTION_TYPE),
		timeUpdate,
		trails: points.filter(point => point.type === NAME_TRAIL_TYPE)
	};
};

export {
	props
};
