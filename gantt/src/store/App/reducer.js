// @flow
import type {AppAction, AppState} from './types';
import {APP_EVENTS} from './constants';
import {deepClone} from 'helpers';
import {defaultAppAction, initialAppState} from './init';

const reducer = (state: AppState = initialAppState, action: AppAction = defaultAppAction): AppState => {
	switch (action.type) {
		case APP_EVENTS.HIDE_LOADER_DATA:
			return {
				...state,
				loadingData: false
			};
		case APP_EVENTS.SHOW_LOADER_DATA:
			return {
				...state,
				errorData: '',
				loadingData: true
			};
		case APP_EVENTS.HIDE_LOADER_SETTINGS:
			return {
				...state,
				loadingSettings: false
			};
		case APP_EVENTS.SHOW_LOADER_SETTINGS:
			return {
				...state,
				errorSettings: '',
				loadingSettings: true
			};
		case APP_EVENTS.SET_CONTENT_CODE:
			return {
				...state,
				contentCode: action.payload,
				loading: true
			};
		case APP_EVENTS.SET_DIAGRAM_KEY:
			return {
				...state,
				diagramKey: action.payload,
				loading: true
			};
		case APP_EVENTS.SET_SUBJECT_UUID:
			return {
				...state,
				loading: true,
				subjectUuid: action.payload
			};
		case APP_EVENTS.SET_ERROR_COMMON:
			return {
				...state,
				errorCommon: action.payload,
				loading: false
			};
		case APP_EVENTS.SET_ERROR_DATA:
			return {
				...state,
				errorData: action.payload,
				loading: false
			};
		case APP_EVENTS.SET_ERROR_SETTINGS:
			return {
				...state,
				errorSettings: action.payload,
				loading: false
			};
		case APP_EVENTS.SET_COMMON_SETTINGS:
			return {
				...state,
				loading: true,
				settings: action.payload
			};
		case APP_EVENTS.SET_USER_DATA:
			return {
				...state,
				loading: true,
				user: action.payload
			};
		case APP_EVENTS.SET_RESOURCE_SETTINGS:
			return {
				...state,
				loading: true,
				resources: action.payload
			};
		case APP_EVENTS.SET_DIAGRAM_DATA:
			return {
				...state,
				loading: true,
				tasks: action.payload
			};
		case APP_EVENTS.SET_SOURCES:
			return {
				...state,
				sources: action.payload
			};
		case APP_EVENTS.CANCEL_SETTINGS:
			return {
				...state,
				resources: deepClone(state.masterResources),
				settings: deepClone(state.masterSettings)
			};
		case APP_EVENTS.SAVE_MASTER_SETTINGS:
			return {
				...state,
				loading: true,
				masterResources: deepClone(state.resources),
				masterSettings: deepClone(state.settings),
			};
		case APP_EVENTS.SET_COLUMN_SETTINGS:
			return {
				...state,
				settings: {...state.settings, columnSettings: action.payload}
			};
		default:
			return state;
	}
};

export default reducer;
