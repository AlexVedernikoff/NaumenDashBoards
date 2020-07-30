// @flow
import {DASHBOARD_EVENTS, LAYOUT_MODE} from './constants';

export type LayoutMode = $Keys<typeof LAYOUT_MODE>;

type ChangeAutoUpdateSettings = {
	payload: Object,
	type: typeof DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS
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
	payload: null,
	type: typeof DASHBOARD_EVENTS.REQUEST_DASHBOARD
};

export type ReceiveDashboard = {
	payload: null,
	type: typeof DASHBOARD_EVENTS.RECEIVE_DASHBOARD
};

type RecordDashboardError = {
	payload: null,
	type: typeof DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR
};

type SetEditable = {
	payload: boolean,
	type: typeof DASHBOARD_EVENTS.SET_EDITABLE_PARAM
};

type ChangeLayoutMode = {
	payload: LayoutMode,
	type: typeof DASHBOARD_EVENTS.CHANGE_LAYOUT_MODE,
};

type SetPersonal = {
	payload: boolean,
	type: typeof DASHBOARD_EVENTS.SET_PERSONAL
};

type SwitchOnEditMode = {
	type: typeof DASHBOARD_EVENTS.SWITCH_ON_EDIT_MODE
};

type SwitchOffEditMode = {
	type: typeof DASHBOARD_EVENTS.SWITCH_OFF_EDIT_MODE
};

type UnknownDashboardAction = {
	payload: null,
	type: typeof DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION
};

export type SettingsAction =
	| ChangeAutoUpdateSettings
	| ChangeLayoutMode
	| CreatePersonalDashboard
	| CreatedPersonalDashboard
	| DeletePersonalDashboard
	| DeletedPersonalDashboard
	| ErrorCreatePersonalDashboard
	| ErrorDeletePersonalDashboard
	| RequestDashboard
	| ReceiveDashboard
	| RecordDashboardError
	| SetEditable
	| SetPersonal
	| SwitchOnEditMode
	| SwitchOffEditMode
	| UnknownDashboardAction
;

export type AutoUpdateSettings = {
	defaultInterval: number,
	enabled: boolean,
	fn?: IntervalID,
	interval: number
};

export type SettingsState = {
	autoUpdate: AutoUpdateSettings,
	editable: boolean,
	editMode: boolean,
	error: boolean,
	layoutMode: LayoutMode,
	loading: boolean,
	personal: boolean,
	personalCreating: boolean,
	personalDeleting: boolean,
	reloadInterval?: number,
};