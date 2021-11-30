// @flow
import type {ContextAction, ContextState} from './types';
import {CONTEXT_EVENTS, DASHBOARD_EDIT_MODE, USER_ROLES} from './constants';

export const initialContextState: ContextState = {
	contentCode: '',
	dashboardMode: DASHBOARD_EDIT_MODE.INIT,
	metaClass: '',
	subjectUuid: '',
	switching: false,
	temp: null,
	user: {
		email: '',
		hasPersonalDashboard: false,
		name: '',
		role: USER_ROLES.INIT
	}
};

export const defaultContextAction: ContextAction = {
	type: CONTEXT_EVENTS.UNKNOWN_CONTEXT_ACTION
};
