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
			const {dynamicPoints, staticGroups, staticPoints} = action.payload;

			return {
				...state,
				dynamicPoints,
				showSinglePoint: false,
				staticPoints,
				staticGroups,
				success: true
			};
		case GEOLOCATION_EVENTS.RELOAD_ACTIVE_POINT:
			return {
				...state,
				dynamicPoints: action.payload,
				loading: false,
				showSinglePoint: false
			};
		case GEOLOCATION_EVENTS.TOGGLE_FILTER:
			return {
				...state,
				controls: {
					...state.controls,
					filterOpen: !state.controls.filterOpen,
					panelOpen: false
				}
			};
		case GEOLOCATION_EVENTS.TOGGLE_PANEL:
			return {
				...state,
				controls: {
					...state.controls,
					panelOpen: !state.controls.panelOpen
				},
				showSinglePoint: false
			};
		case GEOLOCATION_EVENTS.SET_TAB:
			return {
				...state,
				panelShow: action.payload,
				showSinglePoint: false
			};
		case GEOLOCATION_EVENTS.SET_SINGLE_POINT:
			return {
				...state,
				controls: {
					...state.controls,
					panelOpen: true
				},
				panelShow: action.payload.type,
				showSinglePoint: true,
				singlePoint: action.payload
			};
		case GEOLOCATION_EVENTS.RESET_SINGLE_POINT:
			return {
				...state,
				singlePoint: initialGeolocationState.singlePoint,
				showSinglePoint: false
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
