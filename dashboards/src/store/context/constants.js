// @flow
const END_SWITCH: 'END_SWITCH' = 'END_SWITCH';
const SET_CONTEXT: 'SET_CONTEXT' = 'SET_CONTEXT';
const SET_DASHBOARD_EDIT_MODE: 'SET_DASHBOARD_EDIT_MODE' = 'SET_DASHBOARD_EDIT_MODE';
const SET_TEMP: 'SET_TEMP' = 'SET_TEMP';
const SET_USER_DATA: 'SET_USER_DATA' = 'SET_USER_DATA';
const START_SWITCH: 'START_SWITCH' = 'START_SWITCH';
const UNKNOWN_CONTEXT_ACTION: 'UNKNOWN_CONTEXT_ACTION' = 'UNKNOWN_CONTEXT_ACTION';

const CONTEXT_EVENTS = {
	END_SWITCH,
	SET_CONTEXT,
	SET_DASHBOARD_EDIT_MODE,
	SET_TEMP,
	SET_USER_DATA,
	START_SWITCH,
	UNKNOWN_CONTEXT_ACTION
};

// типы ролей пользователя
const INIT: 'INIT' = 'INIT';
const MASTER: 'MASTER' = 'MASTER';
const REGULAR: 'REGULAR' = 'REGULAR';
const SUPER: 'SUPER' = 'SUPER';

const USER_ROLES = {
	INIT,
	MASTER,
	REGULAR,
	SUPER
};

const EDIT: 'edit:Редактируемый' = 'edit:Редактируемый';
const USER: 'user:Пользовательский' = 'user:Пользовательский';
const USER_SOURCE: "userSource:Пользовательский ограниченный" = 'userSource:Пользовательский ограниченный';
const VIEW_ONLY: "viewOnly:Для просмотра" = 'viewOnly:Для просмотра';

const DASHBOARD_EDIT_MODE = {
	EDIT,
	INIT,
	USER,
	USER_SOURCE,
	VIEW_ONLY
};

export {
	CONTEXT_EVENTS,
	DASHBOARD_EDIT_MODE,
	USER_ROLES
};
