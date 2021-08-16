// @flow
import type {AppAction, AppState} from './types';
import {APP_EVENTS, USER_ROLES} from './constants';

export const initialAppState: AppState = {
	contentCode: '',
	error: false,
	hideEditPanel: false,
	loading: true,
	metaClass: '',
	resources: [],
	settings: {},
	sources: {},
	subjectUuid: '',
	user: {
		email: '',
		name: '',
		role: USER_ROLES.SUPER
	}
};

export const defaultAppAction: AppAction = {
	payload: null,
	type: APP_EVENTS.UNKNOWN_APP_ACTION
};