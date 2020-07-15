// @flow
import type {DashboardAction, DashboardState} from './types';
import {DASHBOARD_EVENTS, DEFAULT_INTERVAL} from './constants';

export const initialDashboardState: DashboardState = {
	autoUpdate: {
		defaultInterval: DEFAULT_INTERVAL,
		enabled: false,
		interval: DEFAULT_INTERVAL
	},
	editMode: false,
	editable: false,
	error: false,
	loading: false,
	personal: false,
	personalCreating: false,
	personalDeleting: false
};

export const defaultDashboardAction: DashboardAction = {
	payload: null,
	type: DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION
};
