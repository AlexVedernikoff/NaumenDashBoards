// @flow
import type {AppAction, AppState} from './types';
import {APP_EVENTS} from './constants';
import {deepClone} from 'helpers';
import {defaultAppAction, initialAppState} from './init';

const reducer = (state: AppState = initialAppState, action: AppAction = defaultAppAction): AppState => {
	switch (action.type) {
		case APP_EVENTS.HIDE_LOADER:
			return {
				...state,
				loading: false
			};
		case APP_EVENTS.SHOW_LOADER:
			return {
				...state,
				error: '',
				loading: true
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
		case APP_EVENTS.SET_ERROR:
			return {
				...state,
				error: action.payload,
				loading: false
			};
		case APP_EVENTS.SET_COMMON_SETTINGS:
			return {
				...state,
				settings: action.payload
			};
		case APP_EVENTS.SET_RESOURCE_SETTINGS:
			return {
				...state,
				resources: action.payload
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
				masterResources: deepClone(state.resources),
				masterSettings: deepClone(state.settings)
			};
		default:
			return state;
	}
};

export default reducer;
