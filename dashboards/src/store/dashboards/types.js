// @flow
import {DASHBOARDS_EVENTS} from './constants';

export type DashboardItem = {
	children: Array<{
		label: string,
		value: string
	}>,
	label: string,
	value: string
};

type RecordDashboardsError = {
	type: typeof DASHBOARDS_EVENTS.RECORD_DASHBOARDS_ERROR
};

type RequestDashboards = {
	type: typeof DASHBOARDS_EVENTS.REQUEST_DASHBOARDS
};

type ResponseDashboards = {
	payload: Array<DashboardItem>,
	type: typeof DASHBOARDS_EVENTS.RESPONSE_DASHBOARDS
};

type UnknownDashboardsAction = {
	type: typeof DASHBOARDS_EVENTS.UNKNOWN_DASHBOARDS_ACTION
};

export type DashboardsAction =
	| RecordDashboardsError
	| RequestDashboards
	| ResponseDashboards
	| UnknownDashboardsAction
;

export type DashboardsState = {
	error: boolean,
	items: Array<DashboardItem>,
	loading: boolean,
	uploaded: boolean
};
