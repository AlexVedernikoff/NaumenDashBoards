// @flow
import {defaultGeolocationAction, initialGeolocationState} from './init';
import {GEOLOCATION_EVENTS} from './constants';
import type {GeolocationAction, GeolocationState} from './types';

const reducer = (state: GeolocationState = initialGeolocationState, action: GeolocationAction = defaultGeolocationAction): GeolocationState => {
	switch (action.type) {
		case GEOLOCATION_EVENTS.SET_CONTEXT:
			return {
				...state,
				context: action.payload
			};
		case GEOLOCATION_EVENTS.SET_PARAMS:
			return {
				...state,
				params: action.payload
			};
		case GEOLOCATION_EVENTS.SET_DATA_GEOLOCATION:
			return {
				...state,
				dynamicMarkers: action.payload.dynamic,
				staticMarkers: action.payload.static,
				success: true
			};
		case GEOLOCATION_EVENTS.RELOAD_ACTIVE_POINT:
			return {
				...state,
				dynamicMarkers: {
					...state.dynamicMarkers,
					[action.payload.uuid]: {
						...state.dynamicMarkers[action.payload.uuid],
						geoposition: action.payload.geoposition
					}
				}
			};
		case GEOLOCATION_EVENTS.RECORD_GEOLOCATION_ERROR:
			return {
				...state,
				error: true,
				loading: false
			};
		default:
			return state;
	}
};

export default reducer;
