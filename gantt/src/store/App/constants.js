// @flow
const CANCEL_SETTINGS: 'CANCEL_SETTINGS' = 'CANCEL_SETTINGS';
const HIDE_LOADER: 'HIDE_LOADER' = 'HIDE_LOADER';
const SAVE_MASTER_SETTINGS: 'SAVE_MASTER_SETTINGS' = 'SAVE_MASTER_SETTINGS';
const SET_COMMON_SETTINGS: 'SET_COMMON_SETTINGS' = 'SET_COMMON_SETTINGS';
const SET_CONTENT_CODE: 'SET_CONTENT_CODE' = 'SET_CONTENT_CODE';
const SET_DIAGRAM_KEY: 'SET_DIAGRAM_KEY' = 'SET_DIAGRAM_KEY';
const SET_ERROR: 'SET_ERROR' = 'SET_ERROR';
const SET_RESOURCE_SETTINGS: 'SET_RESOURCE_SETTINGS' = 'SET_RESOURCE_SETTINGS';
const SET_SOURCES: 'SET_SOURCES' = 'SET_SOURCES';
const SET_SUBJECT_UUID: 'SET_SUBJECT_UUID' = 'SET_SUBJECT_UUID';
const SHOW_LOADER: 'SHOW_LOADER' = 'SHOW_LOADER';
const UNKNOWN_APP_ACTION: 'UNKNOWN_APP_ACTION' = 'UNKNOWN_APP_ACTION';

const APP_EVENTS = {
	CANCEL_SETTINGS,
	HIDE_LOADER,
	SAVE_MASTER_SETTINGS,
	SET_COMMON_SETTINGS,
	SET_CONTENT_CODE,
	SET_DIAGRAM_KEY,
	SET_ERROR,
	SET_RESOURCE_SETTINGS,
	SET_SOURCES,
	SET_SUBJECT_UUID,
	SHOW_LOADER,
	UNKNOWN_APP_ACTION
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

export const ITEM_TYPES_FOR_ALL = [
	{
		code: 'RESOURCE',
		value: 'Ресурс'
	}, {
		code: 'WORK',
		value: 'Работа'
	}
];

export const ITEM_TYPES_FOR_WORK = [ITEM_TYPES_FOR_ALL[1]];

const codeMainColumn = 'd951f959-640b-4b47-b7ed-2f0daf7867';

const defaultCommonSettings = {
	'columnSettings': [
		{
			'code': codeMainColumn,
			'show': true,
			'title': 'Название'
		}
	],
	'rollUp': false,
	'scale': 'MONTH'
};

const defaultAttributeSetting = {
	'attribute': {
		'code': 'title',
		'title': ''
	},
	'code': codeMainColumn
};

const defaultResourceSetting = {
	'attributeSettings': [
		defaultAttributeSetting
	],
	'communicationResourceAttribute': null,
	'communicationWorkAttribute': null,
	'id': '',
	'level': 0,
	'nested': false,
	'parent': '',
	'source': {
		'descriptor': '',
		'value': null
	},
	'type': ITEM_TYPES_FOR_ALL[0]
};

const defaultColumn = {
	'code': '',
	'show': true,
	'title': ''
};

const defaultResourceSettings = [defaultResourceSetting];

export {APP_EVENTS, USER_ROLES, defaultCommonSettings, defaultResourceSetting, defaultResourceSettings, defaultColumn, defaultAttributeSetting};
