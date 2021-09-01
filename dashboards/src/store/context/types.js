// @flow
import {CONTEXT_EVENTS, DASHBOARD_EDIT_MODE, USER_ROLES} from './constants';
import type {CustomGroupsState} from 'store/customGroups/types';
import type {DashboardState} from 'store/dashboard/types';
import type {WidgetsState} from 'store/widgets/types';

export type UserRole = $Keys<typeof USER_ROLES>;

export type DashboardEditMode = $Values<typeof DASHBOARD_EDIT_MODE>;

export type Context = {
	contentCode: string,
	subjectUuid: string
};

type ContentContext = {
	contentCode: string,
	metaClass: string,
	subjectUuid: string
};

type Temp = {
	customGroups: CustomGroupsState,
	dashboard: DashboardState,
	widgets: WidgetsState
};

export type UserData = {
	email: string,
	hasPersonalDashboard: boolean,
	name: string,
	role: UserRole
};

type EndSwitch = {
	type: typeof CONTEXT_EVENTS.END_SWITCH
};

type SetContext = {
	payload: $Exact<ContentContext>,
	type: typeof CONTEXT_EVENTS.SET_CONTEXT
};

type SetEditableParam = {
	payload: DashboardEditMode,
	type: typeof CONTEXT_EVENTS.SET_DASHBOARD_EDIT_MODE
};

type SetTemp = {
	payload: Temp,
	type: typeof CONTEXT_EVENTS.SET_TEMP
};

type SetUserData = {
	payload: UserData,
	type: typeof CONTEXT_EVENTS.SET_USER_DATA
};

type StartSwitch = {
	type: typeof CONTEXT_EVENTS.START_SWITCH
};

type UnknownContextAction = {
	type: typeof CONTEXT_EVENTS.UNKNOWN_CONTEXT_ACTION
};

export type ContextAction =
	| EndSwitch
	| SetContext
	| SetEditableParam
	| SetTemp
	| SetUserData
	| StartSwitch
	| UnknownContextAction
;

export type ContextState = {
	contentCode: string,
	dashboardMode: $Values<typeof DASHBOARD_EDIT_MODE>,
	metaClass: string,
	subjectUuid: string,
	switching: boolean,
	temp: null | Temp,
	user: UserData
};
