// @flow
import type {AppAction, AppState} from './types';
import {APP_EVENTS, USER_ROLES} from './constants';

export const initialAppState: AppState = {
	contentCode: '',
	diagramKey: '',
	errorCommon: false,
	errorData: false,
	errorSettings: false,
	hideEditPanel: false,
	loadingCommon: true,
	loadingData: true,
	loadingSettings: true,
	masterResources: [],
	masterSettings: {},
	metaClass: '',
	resources: [],
	settings: {columnSettings: []},
	sources: {},
	subjectUuid: '',
	tasks: [],
	user: {
		email: '',
		name: '',
		role: USER_ROLES.REGULAR
	}
};

export const defaultAppAction: AppAction = {
	payload: null,
	type: APP_EVENTS.UNKNOWN_APP_ACTION
};
