// @flow
import type {DashboardAction, DashboardState} from './types';
import {DASHBOARD_EVENTS} from './constants';

export const initialDashboardState: DashboardState = {
	error: false,
	isEditable: false,
	loading: false,
	name: 'Новый дашборд'
};

export const defaultDashboardAction: DashboardAction = {
	type: DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION,
	payload: null
};
