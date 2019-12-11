// @flow
import type {Context} from 'utils/api/types';
import {DASHBOARD_EVENTS} from './constants';

export type Role = 'master' | 'super' | typeof undefined;

type ChangeAutoUpdateSettings = {
	type: typeof DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS,
	payload: Object
};

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

type SetAutoUpdateFunction = {
	type: typeof DASHBOARD_EVENTS.SET_AUTO_UPDATE_FUNCTION,
	payload: IntervalID
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
	| ChangeAutoUpdateSettings
	| RequestDashboard
	| ReceiveDashboard
	| ReceiveRoleMaster
	| RecordDashboardError
	| SetAutoUpdateFunction
	| SetContext
	| SetEditable
	| UnknownDashboardAction
;

export type AutoUpdate = {
	defaultInterval: number,
	enabled: boolean,
	fn?: IntervalID,
	interval?: number
}

export type AutoUpdateRequestPayload = {
	enabled: boolean,
	interval: number
}

export type DashboardState = {
	autoUpdate: AutoUpdate,
	context: Context | Object,
	editable: boolean,
	error: boolean,
	loading: boolean,
	reloadInterval?: number,
	role?: Role
};
