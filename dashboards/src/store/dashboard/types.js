// @flow
import type {Context} from 'utils/api/types';
import {DASHBOARD_EVENTS} from './constants';

export type Role = 'master' | 'super';

type RequestDashboard = {
	type: typeof DASHBOARD_EVENTS.REQUEST_DASHBOARD,
	payload: null
};

export type ReceiveDashboard = {
	type: typeof DASHBOARD_EVENTS.RECEIVE_DASHBOARD,
	payload: null
};

export type ReceiveRoleMaster = {
	type: typeof DASHBOARD_EVENTS.RECEIVE_USER_ROLE,
	payload: Role
};

type RecordDashboardError = {
	type: typeof DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR,
	payload: null
};

type SetContext = {
	type: typeof DASHBOARD_EVENTS.SET_CONTEXT,
	payload: Context
};

type SetEditable = {
	type: typeof DASHBOARD_EVENTS.SET_EDITABLE,
	payload: boolean
};

type UnknownDashboardAction = {
	type: typeof DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION,
	payload: null
};

export type DashboardAction =
	| RequestDashboard
	| ReceiveDashboard
	| ReceiveRoleMaster
	| RecordDashboardError
	| SetContext
	| SetEditable
	| UnknownDashboardAction
;

export type DashboardState = {
	context: Context | Object,
	editable: boolean,
	error: boolean,
	loading: boolean,
	role?: Role
};
