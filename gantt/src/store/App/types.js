// @flow
import {APP_EVENTS, USER_ROLES} from './constants';

export type CommonSettings = {
	columnSettings: Array<Object>,
	rollUp: boolean,
	scale: string
};

export type SourceItem = {
	label: string,
	value: string
};

export type Source = {
	descriptor: string,
	value: SourceItem
};

export type ResourceSetting = {
	attributeSettings: Array<Object>,
	communicationResourceAttribute: Object,
	nested: boolean,
	source: Source,
	type: string
};

export type ResourceSettings = Array<ResourceSetting>;

export type UserRole = $Keys<typeof USER_ROLES>;

export type UserData = {
	email: string,
	name: string,
	role: UserRole
};

type ShowLoader = {
	type: typeof APP_EVENTS.SHOW_LOADER,
};

type HideLoader = {
	type: typeof APP_EVENTS.HIDE_LOADER,
};

type SetError = {
	payload: string,
	type: typeof APP_EVENTS.SET_ERROR
};

type SetParams = {
	payload: Params,
	type: typeof APP_EVENTS.SET_PARAMS
};

type DefaultAppAction = {
	payload: null,
	type: typeof APP_EVENTS.UNKNOWN_APP_ACTION
};

export type AppAction =
	| ShowLoader
	| HideLoader
	| SetParams
	| SetError
	| DefaultAppAction
;

export type AppState = {
	contentCode: string,
	error: boolean,
	loading: boolean,
	metaClass: string,
	params: Params,
	subjectUuid: string,
	user: UserData
};
