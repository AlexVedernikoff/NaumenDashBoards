// @flow
import type {DashboardsAction, DashboardsState} from './types';
import {DASHBOARDS_EVENTS} from './constants';

export const initialState: DashboardsState = {
	error: false,
	items: [],
	loading: false,
	uploaded: false
};

export const defaultAction: DashboardsAction = {
	type: DASHBOARDS_EVENTS.UNKNOWN_DASHBOARDS_ACTION
};
