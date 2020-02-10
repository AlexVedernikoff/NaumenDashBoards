// @flow
const END_SWITCH: 'END_SWITCH' = 'END_SWITCH';
const SET_CONTEXT: 'SET_CONTEXT' = 'SET_CONTEXT';
const SET_TEMP: 'SET_TEMP' = 'SET_TEMP';
const SET_USER_DATA: 'SET_USER_DATA' = 'SET_USER_DATA';
const START_SWITCH: 'START_SWITCH' = 'START_SWITCH';
const UNKNOWN_CONTEXT_ACTION: 'UNKNOWN_CONTEXT_ACTION' = 'UNKNOWN_CONTEXT_ACTION';

const CONTEXT_EVENTS = {
	END_SWITCH,
	SET_CONTEXT,
	SET_TEMP,
	SET_USER_DATA,
	START_SWITCH,
	UNKNOWN_CONTEXT_ACTION
};

// типы ролей пользователя
const MASTER: 'MASTER' = 'MASTER';
const REGULAR: 'REGULAR' = 'REGULAR';
const SUPER: 'SUPER' = 'SUPER';

const USER_ROLES = {
	MASTER,
	REGULAR,
	SUPER
};

export {
	CONTEXT_EVENTS,
	USER_ROLES
};
