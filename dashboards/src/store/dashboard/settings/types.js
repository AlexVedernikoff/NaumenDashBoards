// @flow
import type {ChangingState, ThunkAction} from 'store/types';
import {DASHBOARD_EVENTS, LAYOUT_MODE} from './constants';
import type {User} from 'store/users/types';

export type LayoutMode = $Keys<typeof LAYOUT_MODE>;

export type SendToEmails = (name: string, type: string, file: Blob, users: Array<User>) => ThunkAction;

export type AutoUpdateSettings = {
	defaultInterval: number,
	enabled: boolean,
	interval: number,
	remainder: number
};

type ChangeIntervalReminder = {
	payload: number,
	type: typeof DASHBOARD_EVENTS.CHANGE_INTERVAL_REMINDER
};

type ChangeAutoUpdateSettings = {
	payload: $Shape<AutoUpdateSettings>,
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

type RecordDashboardError = {
	payload: null,
	type: typeof DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR
};

type RecordExportingFileToEmailError = {
	payload: null,
	type: typeof DASHBOARD_EVENTS.RECORD_EXPORTING_FILE_TO_EMAIL_ERROR
};

type RequestExportingFileToEmail = {
	type: typeof DASHBOARD_EVENTS.REQUEST_EXPORTING_FILE_TO_EMAIL
};

type RequestDashboard = {
	payload: null,
	type: typeof DASHBOARD_EVENTS.REQUEST_DASHBOARD
};

export type ReceiveDashboard = {
	payload: null,
	type: typeof DASHBOARD_EVENTS.RECEIVE_DASHBOARD
};

export type ResponseExportingFileToEmail = {
	type: typeof DASHBOARD_EVENTS.RESPONSE_EXPORTING_FILE_TO_EMAIL
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
	| ChangeIntervalReminder
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
	| RecordExportingFileToEmailError
	| RequestExportingFileToEmail
	| ResponseExportingFileToEmail
	| SetEditable
	| SetPersonal
	| SwitchOnEditMode
	| SwitchOffEditMode
	| UnknownDashboardAction
;

export type SettingsState = {
	autoUpdate: AutoUpdateSettings,
	editable: boolean,
	editMode: boolean,
	error: boolean,
	exportingFailToEmail: ChangingState,
	layoutMode: LayoutMode,
	loading: boolean,
	personal: boolean,
	personalCreating: boolean,
	personalDeleting: boolean,
	reloadInterval?: number,
};
