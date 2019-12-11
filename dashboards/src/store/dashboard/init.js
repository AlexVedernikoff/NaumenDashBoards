// @flow
import type {DashboardAction, DashboardState} from './types';
import {DASHBOARD_EVENTS} from './constants';

export const initialDashboardState: DashboardState = {
	autoUpdate: {
		defaultInterval: 15,
		enabled: true
	},
	context: {
		contentCode: '',
		subjectUuid: ''
	},
	editable: false,
	error: false,
	loading: false
};

export const defaultDashboardAction: DashboardAction = {
	type: DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION,
	payload: null
};
