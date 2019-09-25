// @flow
import {DASHBOARD_EVENTS} from './constants';

type RequestDashboard = {
	type: typeof DASHBOARD_EVENTS.REQUEST_DASHBOARD,
	payload: null
};

export type ReceiveDashboard = {
	type: typeof DASHBOARD_EVENTS.RECEIVE_DASHBOARD,
	payload: null
};

type RecordDashboardError = {
	type: typeof DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR,
	payload: null
};

type ResetEditable = {
	type: typeof DASHBOARD_EVENTS.RESET_EDITABLE,
	payload: null
};

type SetEditable = {
	type: typeof DASHBOARD_EVENTS.SET_EDITABLE,
	payload: null
};

type UnknownDashboardAction = {
	type: typeof DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION,
	payload: null
};

export type DashboardAction =
	| RequestDashboard
	| ReceiveDashboard
	| RecordDashboardError
	| ResetEditable
	| SetEditable
	| UnknownDashboardAction
;

export type DashboardState = {
	error: boolean,
	isEditable: boolean,
	loading: boolean,
	name: string
};
