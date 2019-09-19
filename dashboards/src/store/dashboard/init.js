// @flow
import type {DashboardAction, DashboardState} from './types';
import {DASHBOARD_EVENTS} from './constants';

export const initialDashboardState: DashboardState = {
	editedWidgetId: null,
	widgets: []
};

export const defaultAction: DashboardAction = {
	type: DASHBOARD_EVENTS.UNKNOWN,
	payload: null
};
