// @flow
import type {ConnectedProps} from './types';
import type {AppState} from 'store/types';
import {filterByGroup} from 'helpers/marker';

const props = (state: AppState): ConnectedProps => {
	const {dynamicPoints, params, staticGroups, staticPoints, timeUpdate} = state.geolocation;
	const {groupingMethodName} = params;
	const points = filterByGroup(staticPoints, staticGroups, groupingMethodName);

	return {
		dynamicPoints: dynamicPoints.filter(point => point.geoposition !== null),
		staticPoints: points.filter(point => point.geoposition !== null),
		timeUpdate
	};
};

export {
	props
};
