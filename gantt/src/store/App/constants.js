// @flow
const CANCEL_SETTINGS: 'CANCEL_SETTINGS' = 'CANCEL_SETTINGS';
const CHANGE_SCALE: 'CHANGE_SCALE' = 'CHANGE_SCALE';
const HIDE_LOADER_DATA: 'HIDE_LOADER_DATA' = 'HIDE_LOADER_DATA';
const HIDE_LOADER_SETTINGS: 'HIDE_LOADER_SETTINGS' = 'HIDE_LOADER_SETTINGS';
const SAVE_MASTER_SETTINGS: 'SAVE_MASTER_SETTINGS' = 'SAVE_MASTER_SETTINGS';
const SET_ATTRIBUTE: 'SET_ATTRIBUTE' = 'SET_ATTRIBUTE';
const SET_ATTRIBUTE_MAP: 'SET_ATTRIBUTE_MAP' = 'SET_ATTRIBUTE_MAP';
const SET_ENTITY_LIST: 'SET_ENTITY_LIST' = 'SET_ENTITY_LIST';
const SET_COLUMN_SETTINGS: 'SET_COLUMN_SETTINGS' = 'SET_COLUMN_SETTINGS';
const SET_COLUMN_TASK: 'SET_COLUMN_TASK' = 'SET_COLUMN_TASK';
const SET_COMMON_SETTINGS: 'SET_COMMON_SETTINGS' = 'SET_COMMON_SETTINGS';
const SET_CURRENT_VALUE_FOR_INTERVAL: 'SET_CURRENT_VALUE_FOR_INTERVAL' = 'SET_CURRENT_VALUE_FOR_INTERVAL';
const SET_CURRENT_VERSION: 'SET_CURRENT_VERSION' = 'SET_CURRENT_VERSION';
const SET_DIAGRAM_DATA: 'SET_DIAGRAM_DATA' = 'SET_DIAGRAM_DATA';
const SET_CONTENT_CODE: 'SET_CONTENT_CODE' = 'SET_CONTENT_CODE';
const SET_DIAGRAM_KEY: 'SET_DIAGRAM_KEY' = 'SET_DIAGRAM_KEY';
const SET_ERROR_ATTRIBUTE: 'SET_ERROR_ATTRIBUTE' = 'SET_ERROR_ATTRIBUTE';
const SET_ERROR_COMMON: 'SET_ERROR_COMMON' = 'SET_ERROR_COMMON';
const SET_ERROR_DATA: 'SET_ERROR_DATA' = 'SET_ERROR_DATA';
const SET_ERROR_SETTINGS: 'SET_ERROR_SETTINGS' = 'SET_ERROR_SETTINGS';
const SET_LINKS_DIAGRAM_DATA: 'SET_LINKS_DIAGRAM_DATA' = 'SET_LINKS_DIAGRAM_DATA';
const SHOW_LOADER_DATA: 'SHOW_LOADER_DATA' = 'SHOW_LOADER_DATA';
const SHOW_LOADER_SETTINGS: 'SHOW_LOADER_SETTINGS' = 'SHOW_LOADER_SETTINGS';
const SET_LIST_VERSIONS: 'SET_LIST_VERSIONS' = 'SET_LIST_VERSIONS';
const SET_MANDATORY_ATTRIBUTES: 'SET_MANDATORY_ATTRIBUTES' = 'SET_MANDATORY_ATTRIBUTES';
const SET_PERSONAL: 'SET_PERSONAL' = 'SET_PERSONAL';
const SET_PERSONAL_VIEW: 'SET_PERSONAL_VIEW' = 'SET_PERSONAL_VIEW';
const SET_RANGE_TIME: 'SET_RANGE_TIME' = 'SET_RANGE_TIME';
const SET_RESOURCE_SETTINGS: 'SET_RESOURCE_SETTINGS' = 'SET_RESOURCE_SETTINGS';
const SET_SOURCES: 'SET_SOURCES' = 'SET_SOURCES';
const SET_SUBJECT_UUID: 'SET_SUBJECT_UUID' = 'SET_SUBJECT_UUID';
const SET_TASK: 'SET_TASK' = 'SET_TASK';
const SET_TEXT_WORK: 'SET_TEXT_WORK' = 'SET_TEXT_WORK';
const SET_USERS: 'SET_USERS' = 'SET_USERS';
const SET_USER_DATA: 'SET_USER_DATA' = 'SET_USER_DATA';
const SET_WORK_DATA: 'SET_WORK_DATA' = 'SET_WORK_DATA';
const SET_WORK_LINK: 'SET_WORK_LINK' = 'SET_WORK_LINK';
const SET_WORK_PROGRESS: 'SET_WORK_PROGRESS' = 'SET_WORK_PROGRESS';
const SET_WORK_ATTRIBUTES: 'SET_WORK_ATTRIBUTES' = 'SET_WORK_ATTRIBUTES';
const UNKNOWN_APP_ACTION: 'UNKNOWN_APP_ACTION' = 'UNKNOWN_APP_ACTION';
const SWITCH_PROGRESS_CHECKBOX: 'SWITCH_PROGRESS_CHECKBOX' = 'SWITCH_PROGRESS_CHECKBOX';
const SWITCH_WORK_RELATION_CHECKBOX: 'SWITCH_WORK_RELATION_CHECKBOX' = 'SWITCH_WORK_RELATION_CHECKBOX';
const SWITCH_MILESTONES_CHECKBOX: 'APP_EVENTS.SWITCH_MILESTONES_CHECKBOX' = 'APP_EVENTS.SWITCH_MILESTONES_CHECKBOX';
const SWITCH_STATE_MILESTONES_CHECKBOX: 'SWITCH_STATE_MILESTONES_CHECKBOX' = 'SWITCH_STATE_MILESTONES_CHECKBOX';
const SWITCH_WORKS_WITHOUT_START_OR_END_DATE_CHECKBOX: 'SWITCH_WORKS_WITHOUT_START_OR_END_DATE_CHECKBOX' = 'SWITCH_WORKS_WITHOUT_START_OR_END_DATE_CHECKBOX';
const SWITCH_MULTIPLICITY_CHECKBOX: 'SWITCH_MULTIPLICITY_CHECKBOX' = 'SWITCH_MULTIPLICITY_CHECKBOX';
const SWITCH_VACATION_AND_WEEKENDS_CHECKBOX: 'SWITCH_VACATION_AND_WEEKENDS_CHECKBOX' = 'SWITCH_VACATION_AND_WEEKENDS_CHECKBOX';
const SWITCH_VIEW_OF_NESTING_CHECKBOX: 'SWITCH_VIEW_OF_NESTING_CHECKBOX' = 'SWITCH_VIEW_OF_NESTING_CHECKBOX';
const SWITCH_TEXT_POSITION_CHECKBOX: 'SWITCH_TEXT_POSITION_CHECKBOX' = 'SWITCH_TEXT_POSITION_CHECKBOX';

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
	SET_CURRENT_VALUE_FOR_INTERVAL,
	SET_CURRENT_VERSION,
	SET_DIAGRAM_DATA,
	SET_DIAGRAM_KEY,
	SET_ENTITY_LIST,
	SET_ERROR_ATTRIBUTE,
	SET_ERROR_COMMON,
	SET_ERROR_DATA,
	SET_ERROR_SETTINGS,
	SET_LINKS_DIAGRAM_DATA,
	SET_LIST_VERSIONS,
	SET_MANDATORY_ATTRIBUTES,
	SET_PERSONAL,
	SET_PERSONAL_VIEW,
	SET_RANGE_TIME,
	SET_RESOURCE_SETTINGS,
	SET_SOURCES,
	SET_SUBJECT_UUID,
	SET_TASK,
	SET_TEXT_WORK,
	SET_USERS,
	SET_USER_DATA,
	SET_WORK_ATTRIBUTES,
	SET_WORK_DATA,
	SET_WORK_LINK,
	SET_WORK_PROGRESS,
	SHOW_LOADER_DATA,
	SHOW_LOADER_SETTINGS,
	SWITCH_MILESTONES_CHECKBOX,
	SWITCH_MULTIPLICITY_CHECKBOX,
	SWITCH_PROGRESS_CHECKBOX,
	SWITCH_STATE_MILESTONES_CHECKBOX,
	SWITCH_TEXT_POSITION_CHECKBOX,
	SWITCH_VACATION_AND_WEEKENDS_CHECKBOX,
	SWITCH_VIEW_OF_NESTING_CHECKBOX,
	SWITCH_WORKS_WITHOUT_START_OR_END_DATE_CHECKBOX,
	SWITCH_WORK_RELATION_CHECKBOX,
	UNKNOWN_APP_ACTION
};

// типы ролей пользователя
const ganttMaster: 'ganttMaster' = 'ganttMaster';
const REGULAR: 'REGULAR' = 'REGULAR';
const SUPER: 'SUPER' = 'SUPER';

const USER_ROLES = {
	ganttMaster,
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
			'editor':
				{
					map_to: 'text',
					type: 'text'
				},
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
	'type': 'RESOURCE'
};

const defaultColumn = {
	'code': '',
	'show': true,
	'title': ''
};

const defaultResourceSettings = [
	{
		'attributeSettings': [
			{
				'attribute': {
					'code': 'title',
					'declaredMetaClass': null,
					'label': null,
					'metaClassFqn': null,
					'property': null,
					'ref': null,
					'sourceCode': null,
					'sourceName': null,
					'title': 'Название',
					'type': null,
					'value': null
				},
				'code': 'efee4e5e-db51-481a-9e9a-d7724a1e4739',
				'title': 'Название'
			}
		],
		'color': null,
		'communicationResourceAttribute': null,
		'id': '652b7ea3-c9d8-4c80-90aa-6e1fe0705e0a',
		'level': 0,
		'nested': false,
		'parent': '',
		'render': null,
		'source': {
			'descriptor': '',
			'value': {
				'label': 'Сотрудник',
				'value': 'employee'
			}
		},
		'textColor': null,
		'type': 'RESOURCE',
		'typeEntity': null
	},
	{
		'attributeSettings': [
			{
				'attribute': {
					'code': 'title',
					'declaredMetaClass': null,
					'label': null,
					'metaClassFqn': null,
					'property': null,
					'ref': null,
					'sourceCode': null,
					'sourceName': null,
					'title': 'Название',
					'type': null,
					'value': null
				},
				'code': 'efee4e5e-db51-481a-9e9a-d7724a1e4739',
				'title': 'Название'
			}
		],
		'color': null,
		'communicationResourceAttribute': {
			'code': 'responsibleEmployee',
			'declaredMetaClass': 'serviceCall',
			'label': null,
			'metaClassFqn': 'serviceCall',
			'property': 'employee',
			'ref': null,
			'sourceCode': 'serviceCall',
			'sourceName': 'Заявка',
			'title': 'Ответственный (сотрудник)',
			'type': 'object',
			'value': null
		},
		'endWorkAttribute': {
			'code': 'dateDecision',
			'declaredMetaClass': 'serviceCall',
			'label': null,
			'metaClassFqn': 'serviceCall',
			'property': null,
			'ref': null,
			'sourceCode': 'serviceCall',
			'sourceName': 'Заявка',
			'title': 'Дата решения',
			'type': 'dateTime',
			'value': null
		},
		'id': 'bf2c8ccb-bd88-4a0c-a00c-6f2158230194',
		'level': 1,
		'nested': false,
		'parent': '652b7ea3-c9d8-4c80-90aa-6e1fe0705e0a',
		'render': null,
		'source': {
			'descriptor': '',
			'value': {
				'label': 'Заявка',
				'value': 'serviceCall'
			}
		},
		'startWorkAttribute': {
			'code': 'registrationDate',
			'declaredMetaClass': 'serviceCall',
			'label': null,
			'metaClassFqn': 'serviceCall',
			'property': null,
			'ref': null,
			'sourceCode': 'serviceCall',
			'sourceName': 'Заявка',
			'title': 'Дата регистрации',
			'type': 'dateTime',
			'value': null
		},
		'textColor': null,
		'type': 'WORK',
		'typeEntity': null
	}
];

export {APP_EVENTS, USER_ROLES, defaultCommonSettings, defaultResourceSetting, defaultResourceSettings, defaultColumn, defaultAttributeSetting};
