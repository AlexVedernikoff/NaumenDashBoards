// @flow
import type {ChangingState, ThunkAction} from 'store/types';
import {EDIT_PANEL_POSITION, LAYOUT_BREAKPOINTS, LAYOUT_MODE} from './constants';
import type {User} from 'store/users/types';

export type LayoutMode = $Keys<typeof LAYOUT_MODE>;
export type LayoutBreakpoint = $Values<typeof LAYOUT_BREAKPOINTS>;
export type LayoutBreakpointsData<T> = {[LayoutBreakpoint]: T};

export type SendToEmailsAction = (name: string, type: string, file: Blob, users: Array<User>) => ThunkAction;

export type AutoUpdateSettings = {
	defaultInterval: number,
	enabled: boolean,
	interval: number
};

export type EditPanelPosition = $Keys<typeof EDIT_PANEL_POSITION>;

type ChangeAutoUpdateSettings = {
	payload: $Shape<AutoUpdateSettings>,
	type: 'dashboard/settings/changeAutoUpdateSettings'
};

type ChangeShowHeader = {
	payload: boolean,
	type: 'dashboard/settings/changeShowHeader'
};

type CreatePersonalDashboard = {
	type: 'dashboard/settings/createPersonalDashboard'
};

type CreatedPersonalDashboard = {
	type: 'dashboard/settings/createdPersonalDashboard'
};

type DeletePersonalDashboard = {
	type: 'dashboard/settings/deletePersonalDashboard'
};

type DeletedPersonalDashboard = {
	type: 'dashboard/settings/deletedPersonalDashboard'
};

type ErrorCreatePersonalDashboard = {
	type: 'dashboard/settings/errorCreatePersonalDashboard'
};

type ErrorDeletePersonalDashboard = {
	type: 'dashboard/settings/errorDeletePersonalDashboard'
};

type RecordDashboardError = {
	payload: string,
	type: 'dashboard/settings/recordDashboardError'
};

type RecordExportingFileToEmailError = {
	payload: null,
	type: 'dashboard/settings/recordExportingFileToEmailError'
};

type RequestExportingFileToEmail = {
	type: 'dashboard/settings/requestExportingFileToEmail'
};

type RequestDashboard = {
	payload: null,
	type: 'dashboard/settings/requestDashboard'
};

export type ReceiveDashboard = {
	payload: null,
	type: 'dashboard/settings/receiveDashboard'
};

export type ResponseExportingFileToEmail = {
	type: 'dashboard/settings/responseExportingFileToEmail'
};

type ChangeLayoutMode = {
	payload: LayoutMode,
	type: 'dashboard/settings/changeLayoutMode'
};

type SetCode = {
	payload: string,
	type: 'dashboard/settings/setCode'
};

type SetDashboardUUID = {
	payload: string,
	type: 'dashboard/settings/setDashboardUUID'
};

type SetEditPanelPosition = {
	payload: EditPanelPosition,
	type: 'dashboard/settings/setEditPanelPosition'
};

type SetHideEditPanel = {
	payload: boolean,
	type: 'dashboard/settings/setHideEditPanel'
};

type SetShowCopyPanel = {
	payload: boolean,
	type: 'dashboard/settings/setShowCopyPanel'
};

type SetPersonal = {
	payload: boolean,
	type: 'dashboard/settings/setPersonal'
};

type SetWidthEditPanel = {
	payload: number,
	type: 'dashboard/settings/setWidthEditPanel'
};

type SwitchOnEditMode = {
	type: 'dashboard/settings/switchOnEditMode'
};

type SwitchOffEditMode = {
	type: 'dashboard/settings/switchOffEditMode'
};

type UnknownDashboardAction = {
	payload: null,
	type: 'dashboard/settings/unknownDashboardAction'
};

export type SettingsAction =
	| ChangeAutoUpdateSettings
	| ChangeLayoutMode
	| ChangeShowHeader
	| CreatedPersonalDashboard
	| CreatePersonalDashboard
	| DeletedPersonalDashboard
	| DeletePersonalDashboard
	| ErrorCreatePersonalDashboard
	| ErrorDeletePersonalDashboard
	| ReceiveDashboard
	| RecordDashboardError
	| RecordExportingFileToEmailError
	| RequestDashboard
	| RequestExportingFileToEmail
	| ResponseExportingFileToEmail
	| SetCode
	| SetDashboardUUID
	| SetEditPanelPosition
	| SetHideEditPanel
	| SetPersonal
	| SetShowCopyPanel
	| SetWidthEditPanel
	| SwitchOffEditMode
	| SwitchOnEditMode
	| UnknownDashboardAction
;

export type SettingsState = {
	autoUpdate: AutoUpdateSettings,
	code: string,
	dashboardUUID: string,
	editMode: boolean,
	editPanelPosition: EditPanelPosition,
	error: ?string,
	exportingFailToEmail: ChangingState,
	hideEditPanel: boolean,
	isMobileDevice: boolean,
	layoutMode: LayoutMode,
	loading: boolean,
	personal: boolean,
	personalCreating: boolean,
	personalDeleting: boolean,
	reloadInterval?: number,
	showCopyPanel: boolean,
	showHeader: boolean,
	widthEditPanel: number
};
