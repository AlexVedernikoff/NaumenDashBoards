// @flow
import type {ContextAction, ContextState} from './types';
import {CONTEXT_EVENTS, USER_ROLES} from './constants';

export const initialContextState: ContextState = {
	contentCode: '',
	subjectUuid: '',
	switching: false,
	temp: null,
	user: {
		hasPersonalDashboard: false,
		role: USER_ROLES.REGULAR
	}
};

export const defaultContextAction: ContextAction = {
	type: CONTEXT_EVENTS.UNKNOWN_CONTEXT_ACTION
};
