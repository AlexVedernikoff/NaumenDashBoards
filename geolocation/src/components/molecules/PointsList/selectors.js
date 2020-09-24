// @flow
import type {ConnectedProps} from './types';
import type {AppState} from 'store/types';

const props = (state: AppState): ConnectedProps => {
	const {dynamicPoints, staticPoints} = state.geolocation;

	return {
		dynamicPoints: dynamicPoints.filter(point => point.geoposition !== null),
		staticPoints: staticPoints.filter(point => point.geoposition !== null)
	};
};

export {
	props
};
