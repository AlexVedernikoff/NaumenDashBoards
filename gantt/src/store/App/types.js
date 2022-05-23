// @flow
import {APP_EVENTS, USER_ROLES} from './constants';

export type Column = {
	code: string,
	show: boolean,
	title: string
};

export type CommonSettings = {
	columnSettings: Array<Column>,
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

export type DiagramData = {
	id: string,
	parent: string
};

export type ResourceSetting = {
	attributeSettings: Array<Object>,
	communicationResourceAttribute: Object,
	level: number,
	nested: boolean,
	source: Source,
	type: string
};

export type ResourceSettings = Array<ResourceSetting>;

export type Settings = {
	commonSettings: CommonSettings,
	diagramKey: string,
	resourceAndWorkSettings: ResourceSettings
};

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

type Task = {
	endDate: string,
	startDate: string,
	subjectUuid: string | number
};

type DefaultAppAction = {
	payload: null,
	type: typeof APP_EVENTS.UNKNOWN_APP_ACTION
};

export type AppAction =
	| ShowLoader
	| HideLoader
	| SetError
	| DefaultAppAction
;

export type AppState = {
	attributesMap: {},
	contentCode: string,
	error: boolean,
	loading: boolean,
	metaClass: string,
	params: Params,
	subjectUuid: string,
	task: Task,
	user: UserData,
};

export type WorkData = {
	registrationDate?: string,
	stateStartTime?: string,
	title: string
};

export type WorkProgress = {[UUID: string]: number};
export type ListOfAttributes = Array<{code: string, title: string}>;
export type workDateInterval = Array<{dateType: string, value: string, workUUID: string}>;
export type CurrentInterval = {label: string, value: string};
