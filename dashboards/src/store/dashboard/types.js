// @flow
import {DASHBOARD_EVENTS} from './constants';

type ChangeAutoUpdateSettings = {
	type: typeof DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS,
	payload: Object
};

type CreatePersonalDashboard = {
	type: typeof DASHBOARD_EVENTS.CREATE_PERSONAL_DASHBOARD
};

type CreatedPersonalDashboard = {
	type: typeof DASHBOARD_EVENTS.CREATED_PERSONAL_DASHBOARD
};

type DeletePersonalDashboard = {
	type: typeof DASHBOARD_EVENTS.DELETE_PERSONAL_DASHBOARD
};

type DeletedPersonalDashboard = {
	type: typeof DASHBOARD_EVENTS.DELETED_PERSONAL_DASHBOARD
};

type ErrorCreatePersonalDashboard = {
	type: typeof DASHBOARD_EVENTS.ERROR_CREATE_PERSONAL_DASHBOARD
};

type ErrorDeletePersonalDashboard = {
	type: typeof DASHBOARD_EVENTS.ERROR_DELETE_PERSONAL_DASHBOARD
};

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

type SetAutoUpdateFunction = {
	type: typeof DASHBOARD_EVENTS.SET_AUTO_UPDATE_FUNCTION,
	payload: IntervalID
};

type SetEditable = {
	type: typeof DASHBOARD_EVENTS.SET_EDITABLE_PARAM,
	payload: boolean
};

type SetPersonal = {
	type: typeof DASHBOARD_EVENTS.SET_PERSONAL,
	payload: boolean
};

type SwitchOnEditMode = {
	type: typeof DASHBOARD_EVENTS.SWITCH_ON_EDIT_MODE
};

type SwitchOffEditMode = {
	type: typeof DASHBOARD_EVENTS.SWITCH_OFF_EDIT_MODE
};

type UnknownDashboardAction = {
	type: typeof DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION,
	payload: null
};

export type DashboardAction =
	| ChangeAutoUpdateSettings
	| CreatePersonalDashboard
	| CreatedPersonalDashboard
	| DeletePersonalDashboard
	| DeletedPersonalDashboard
	| ErrorCreatePersonalDashboard
	| ErrorDeletePersonalDashboard
	| RequestDashboard
	| ReceiveDashboard
	| RecordDashboardError
	| SetAutoUpdateFunction
	| SetEditable
	| SetPersonal
	| SwitchOnEditMode
	| SwitchOffEditMode
	| UnknownDashboardAction
;

export type AutoUpdate = {
	defaultInterval: number,
	enabled: boolean,
	fn?: IntervalID,
	interval?: number
};

export type AutoUpdateRequestPayload = {
	enabled: boolean,
	interval: number
};

export type DashboardState = {
	autoUpdate: AutoUpdate,
	editable: boolean,
	editMode: boolean,
	error: boolean,
	loading: boolean,
	personal: boolean,
	personalCreating: boolean,
	personalDeleting: boolean,
	reloadInterval?: number,
};
