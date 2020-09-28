// @flow
import type {ConnectedProps} from './types';
import type {AppState} from 'store/types';
import {filterByGroup} from 'helpers/marker';

const props = (state: AppState): ConnectedProps => {
	const {dynamicPoints, staticGroups, staticPoints} = state.geolocation;
	const points = filterByGroup(staticPoints, staticGroups);

	return {
		dynamicPoints: dynamicPoints.filter(point => point.geoposition !== null),
		staticPoints: points.filter(point => point.geoposition !== null)
	};
};

export {
	props
};
