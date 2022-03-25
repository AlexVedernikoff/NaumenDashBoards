// @flow
const SET_ATTRIBUTE_MAP: 'SET_ATTRIBUTE_MAP' = 'SET_ATTRIBUTE_MAP';
const CANCEL_SETTINGS: 'CANCEL_SETTINGS' = 'CANCEL_SETTINGS';
const CHANGE_SCALE: 'CHANGE_SCALE' = 'CHANGE_SCALE';
const HIDE_LOADER_DATA: 'HIDE_LOADER_DATA' = 'HIDE_LOADER_DATA';
const HIDE_LOADER_SETTINGS: 'HIDE_LOADER_SETTINGS' = 'HIDE_LOADER_SETTINGS';
const SET_ATTRIBUTE: 'SET_ATTRIBUTE' = 'SET_ATTRIBUTE';
const SAVE_MASTER_SETTINGS: 'SAVE_MASTER_SETTINGS' = 'SAVE_MASTER_SETTINGS';
const SET_COLUMN_SETTINGS: 'SET_COLUMN_SETTINGS' = 'SET_COLUMN_SETTINGS';
const SET_COMMON_SETTINGS: 'SET_COMMON_SETTINGS' = 'SET_COMMON_SETTINGS';
const SET_DIAGRAM_DATA: 'SET_DIAGRAM_DATA' = 'SET_DIAGRAM_DATA';
const SET_CONTENT_CODE: 'SET_CONTENT_CODE' = 'SET_CONTENT_CODE';
const SET_DIAGRAM_KEY: 'SET_DIAGRAM_KEY' = 'SET_DIAGRAM_KEY';
const SET_ERROR_COMMON: 'SET_ERROR_COMMON' = 'SET_ERROR_COMMON';
const SET_ERROR_DATA: 'SET_ERROR_DATA' = 'SET_ERROR_DATA';
const SET_ERROR_SETTINGS: 'SET_ERROR_SETTINGS' = 'SET_ERROR_SETTINGS';
const SET_LINKS_DIAGRAM_DATA: 'SET_LINKS_DIAGRAM_DATA' = 'SET_LINKS_DIAGRAM_DATA';
const SET_RANGE_TIME: 'SET_RANGE_TIME' = 'SET_RANGE_TIME';
const SET_RESOURCE_SETTINGS: 'SET_RESOURCE_SETTINGS' = 'SET_RESOURCE_SETTINGS';
const SET_SOURCES: 'SET_SOURCES' = 'SET_SOURCES';
const SET_SUBJECT_UUID: 'SET_SUBJECT_UUID' = 'SET_SUBJECT_UUID';
const SET_TASK: 'SET_TASK' = 'SET_TASK';
const SET_USER_DATA: 'SET_USER_DATA' = 'SET_USER_DATA';
const SHOW_LOADER_DATA: 'SHOW_LOADER_DATA' = 'SHOW_LOADER_DATA';
const SHOW_LOADER_SETTINGS: 'SHOW_LOADER_SETTINGS' = 'SHOW_LOADER_SETTINGS';
const UNKNOWN_APP_ACTION: 'UNKNOWN_APP_ACTION' = 'UNKNOWN_APP_ACTION';
const SET_COLUMN_TASK: 'SET_COLUMN_TASK' = 'SET_COLUMN_TASK';
const SET_WORK_PROGRESS: 'SET_WORK_PROGRESS' = 'SET_WORK_PROGRESS';
const SET_WORK_ATTRIBUTES: 'SET_WORK_ATTRIBUTES' = 'SET_WORK_ATTRIBUTES';

const APP_EVENTS = {
	CANCEL_SETTINGS,
	CHANGE_SCALE,
	HIDE_LOADER_DATA,
	HIDE_LOADER_SETTINGS,
	SAVE_MASTER_SETTINGS,
	SET_ATTRIBUTE,
	SET_ATTRIBUTE_MAP,
	SET_COLUMN_SETTINGS,
	SET_COLUMN_TASK,
	SET_COMMON_SETTINGS,
	SET_CONTENT_CODE,
	SET_DIAGRAM_DATA,
	SET_DIAGRAM_KEY,
	SET_ERROR_COMMON,
	SET_ERROR_DATA,
	SET_ERROR_SETTINGS,
	SET_LINKS_DIAGRAM_DATA,
	SET_RANGE_TIME,
	SET_RESOURCE_SETTINGS,
	SET_SOURCES,
	SET_SUBJECT_UUID,
	SET_TASK,
	SET_USER_DATA,
	SET_WORK_ATTRIBUTES,
	SET_WORK_PROGRESS,
	SHOW_LOADER_DATA,
	SHOW_LOADER_SETTINGS,
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

export const codeMainColumn = 'd951f959-640b-4b47-b7ed-2f0daf7867';

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
	'progress': 0.8,
	'source': {
		'descriptor': '',
		'value': null
	},
	'type': 'RESOURCE'
};

const defaultColumn = {
	'code': '',
	'show': true,
	'title': ''
};

const defaultResourceSettings = [defaultResourceSetting];

export {APP_EVENTS, USER_ROLES, defaultCommonSettings, defaultResourceSetting, defaultResourceSettings, defaultColumn, defaultAttributeSetting};
