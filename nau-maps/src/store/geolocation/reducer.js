// @flow
import {defaultGeolocationAction, initialGeolocationState} from './init';
import type {GeolocationAction, GeolocationState} from './types';
import {GEOLOCATION_EVENTS} from './constants';

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
				params: {
					...state.params,
					...action.payload
				}
			};
		case GEOLOCATION_EVENTS.SET_DATA_GEOLOCATION:
			return {
				...state,
				mapObjects: action.payload,
				showSingleObject: false,
				success: true,
				timeUpdate: new Date().getTime()
			};
		case GEOLOCATION_EVENTS.SET_EDIT_FORM:
			return {
				...state,
				editFormCode: action.payload
			};
		case GEOLOCATION_EVENTS.SET_MAP_PANEL:
			return {
				...state,
				mapSelect: action.payload,
				timeUpdate: new Date().getTime()
			};
		case GEOLOCATION_EVENTS.SET_MAP_ARRAY:
			return {
				...state,
				mapsKeyList: {'openStreetMap': true, ...action.payload}
			};
		case GEOLOCATION_EVENTS.RELOAD_ACTIVE_POINT:
			return {
				...state,
				loading: false,
				showSingleObject: false,
				timeUpdate: new Date().getTime()
			};
		case GEOLOCATION_EVENTS.TOGGLE_FILTER:
			return {
				...state,
				controls: {
					...state.controls,
					filterOpen: !state.controls.filterOpen,
					panelOpen: false
				},
				showSingleObject: false
			};
		case GEOLOCATION_EVENTS.TOGGLE_PANEL:
			return {
				...state,
				controls: {
					...state.controls,
					filterOpen: false,
					panelOpen: !state.controls.panelOpen
				},
				showSingleObject: false
			};
		case GEOLOCATION_EVENTS.TOGGLE_MAP_PANEL:
			return {
				...state,
				controls: {
					...state.controls,
					panelMapOpen: !state.controls.panelMapOpen
				}
			};
		case GEOLOCATION_EVENTS.TOGGLE_MAP_CONTENT_MENU:
			return {
				...state,
				controls: {
					...state.controls,
					 mapContentMenuOpen: !state.controls.mapContentMenuOpen
				},
				goToElement: false,
				singleObject: action.payload
			};
		case GEOLOCATION_EVENTS.SET_TAB:
			return {
				...state,
				searchObjects: [],
				searchQuery: '',
				showSingleObject: false
			};
		case GEOLOCATION_EVENTS.SET_SINGLE_POINT:
			return {
				...state,
				controls: {
					...state.controls,
					filterOpen: false,
					panelOpen: true
				},
				goToElement: false,
				showSingleObject: true,
				singleObject: action.payload
			};
		case GEOLOCATION_EVENTS.RESET_SINGLE_POINT:
			return {
				...state,
				controls: {
					...state.controls,
					mapContentMenuOpen: false
				},
				goToElement: false,
				showSingleObject: false,
				singleObject: null
			};
		case GEOLOCATION_EVENTS.GO_TO_ELEMENT:
			return {
				...state,
				goToElement: true
			};
		case GEOLOCATION_EVENTS.TOGGLE_GROUP:
			return {
				...state,
				staticGroups: state.staticGroups.map(group =>
					group.code === action.payload ? {...group, checked: !group.checked} : group
				)
			};
		case GEOLOCATION_EVENTS.SELECT_ALL_GROUPS:
			return {
				...state,
				staticGroups: state.staticGroups.map(group => ({...group, checked: true}))
			};
		case GEOLOCATION_EVENTS.RESET_ALL_GROUPS:
			return {
				...state,
				staticGroups: state.staticGroups.map(group => ({...group, checked: false}))
			};
		case GEOLOCATION_EVENTS.RECORD_GEOLOCATION_ERROR:
			return {
				...state,
				error: true,
				loading: false
			};
		case GEOLOCATION_EVENTS.CHANGE_ZOOM:
			return {
				...state,
				controls: {
					...state.controls,
					zoom: action.payload
				}
			};
		case GEOLOCATION_EVENTS.SET_SEARCH_TEXT:
			return {
				...state,
				searchQuery: action.payload
			};
		case GEOLOCATION_EVENTS.SET_SEARCH_POINTS:
			return {
				...state,
				goToElement: false,
				searchObjects: action.payload,
				showSingleObject: false,
				singleObject: null
			};
		default:
			return state;
	}
};

export default reducer;
