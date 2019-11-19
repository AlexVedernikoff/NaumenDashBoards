// @flow
import type {DashboardAction, DashboardState} from './types';
import {DASHBOARD_EVENTS} from './constants';

export const initialDashboardState: DashboardState = {
	context: {
		contentCode: '',
		subjectUuid: ''
	},
	editable: false,
	error: false,
	loading: false,
	role: null
};

export const defaultDashboardAction: DashboardAction = {
	type: DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION,
	payload: null
};
