// @flow
import {defaultVerifyAction, initialVerifyState} from './init';
import type {EntityAction, EntityState} from './types';
import {VERIFY_EVENTS} from './constants';

const reducer = (state: EntityState = initialVerifyState, action: EntityAction = defaultVerifyAction): EntityState => {
	switch (action.type) {
		case VERIFY_EVENTS.SHOW_LOADER_DATA:
			return {
				...state,
				error: false,
				loading: true
			};
		case VERIFY_EVENTS.HIDE_LOADER_DATA:
			return {
				...state,
				loading: false
			};
		case VERIFY_EVENTS.SET_CENTER_POINT_UUID:
			return {
				...state,
				centerPointUuid: action.uuid
			};
		case VERIFY_EVENTS.SET_ENTITIES_DATA:
			return {
				...state,
				data: action.payload
			};
		case VERIFY_EVENTS.SET_DEFAULT_LOCATION_POINTS:
			return {
				...state,
				dataDefaultLocationPoints: action.payload
			};
		case VERIFY_EVENTS.SET_DEFAULT_VIEW_DATA:
			return {
				...state,
				dataDefaultView: action.payload
			};
		case VERIFY_EVENTS.SET_LIST_VIEWS:
			return {
				...state,
				listViews: action.payload
			};
		case VERIFY_EVENTS.SET_ERROR_DATA:
			return {
				...state,
				error: action.payload
			};
		case VERIFY_EVENTS.SET_ACTIVE_ELEMENT:
			return {
				...state,
				activeElement: action.payload
			};
		case VERIFY_EVENTS.SET_SCALE:
			return {
				...state,
				// centerPointUuid: null,
				scale: action.payload
			};
		case VERIFY_EVENTS.SET_EXPORT_TO:
			return {
				...state,
				exportTo: action.payload
			};
		case VERIFY_EVENTS.SET_POSITION:
			return {
				...state,
				// centerPointUuid: null,
				position: action.payload
			};
		case VERIFY_EVENTS.SET_SEARCH_TEXT:
			return {
				...state,
				searchText: action.payload
			};
		case VERIFY_EVENTS.SET_SEARCH_POINTS:
			return {
				...state,
				searchObjects: action.objects
			};
		case VERIFY_EVENTS.CHANGE_EDITING_GLOBAL:
			return {
				...state,
				editingGlobal: action.payload
			};
		case VERIFY_EVENTS.CHANGE_POPUP_SAVE_VIEWS:
			return {
				...state,
				setting: {
					...state.setting,
					popupSaveViews: action.payload
				}
			};
		case VERIFY_EVENTS.CHANGE_POPUP_SETTING_VIEWS:
			return {
				...state,
				setting: {
					...state.setting,
					popupSettingViews: action.payload
				}
			};
		default:
			return state;
	}
};

export default reducer;
