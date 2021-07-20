// @flow
import {createContext} from 'react';
import type {ObjectsState} from 'src/store/sources/attributesData/objects/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OBJECT_OR_CONDITION_OPTIONS = [
	{
		label: 'Содержит',
		value: OR_CONDITION_TYPES.CONTAINS
	},
	{
		label: 'Не содержит',
		value: OR_CONDITION_TYPES.NOT_CONTAINS
	},
	{
		label: 'Содержит любое из значений',
		value: OR_CONDITION_TYPES.CONTAINS_ANY
	},
	{
		label: 'Название содержит',
		value: OR_CONDITION_TYPES.TITLE_CONTAINS
	},
	{
		label: 'Название не содержит',
		value: OR_CONDITION_TYPES.TITLE_NOT_CONTAINS
	},
	{
		label: 'пусто',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	},
	{
		label: 'Содержит (включая архивные)',
		value: OR_CONDITION_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Не содержит (включая архивные)',
		value: OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Равно текущему объекту',
		value: OR_CONDITION_TYPES.EQUAL_CURRENT_OBJECT
	},
	{
		label: 'Равно атрибуту текущего объекта',
		value: OR_CONDITION_TYPES.EQUAL_ATTR_CURRENT_OBJECT
	}
];

const BO_LINKS_OR_CONDITION_OPTIONS = [
	{
		label: 'Содержит',
		value: OR_CONDITION_TYPES.CONTAINS
	},
	{
		label: 'Не содержит',
		value: OR_CONDITION_TYPES.NOT_CONTAINS
	},
	{
		label: 'Название содержит',
		value: OR_CONDITION_TYPES.TITLE_CONTAINS
	},
	{
		label: 'Название не содержит',
		value: OR_CONDITION_TYPES.TITLE_NOT_CONTAINS
	},
	{
		label: 'пусто',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	},
	{
		label: 'Содержит (включая архивные)',
		value: OR_CONDITION_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Не содержит (включая архивные)',
		value: OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Содержит (включая вложенные)',
		value: OR_CONDITION_TYPES.CONTAINS_INCLUDING_NESTED
	},
	{
		label: 'Содержит текущий объект',
		value: OR_CONDITION_TYPES.CONTAINS_CURRENT_OBJECT
	},
	{
		label: 'Содержит атрибут текущего объекта',
		value: OR_CONDITION_TYPES.CONTAINS_ATTR_CURRENT_OBJECT
	}
];

const BACK_BO_LINKS_OR_CONDITION_OPTIONS = [
	{
		label: 'Содержит',
		value: OR_CONDITION_TYPES.CONTAINS
	},
	{
		label: 'Не содержит',
		value: OR_CONDITION_TYPES.NOT_CONTAINS
	},
	{
		label: 'Название содержит',
		value: OR_CONDITION_TYPES.TITLE_CONTAINS
	},
	{
		label: 'Название не содержит',
		value: OR_CONDITION_TYPES.TITLE_NOT_CONTAINS
	},
	{
		label: 'пусто',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	},
	{
		label: 'Содержит (включая архивные)',
		value: OR_CONDITION_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Не содержит (включая архивные)',
		value: OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Содержит текущий объект',
		value: OR_CONDITION_TYPES.CONTAINS_CURRENT_OBJECT
	},
	{
		label: 'Содержит атрибут текущего объекта',
		value: OR_CONDITION_TYPES.CONTAINS_ATTR_CURRENT_OBJECT
	}
];

const DEFAULT_DATA = {
	actual: {},
	all: {},
	found: {}
};

const DATA_CONTEXT = createContext<ObjectsState>(DEFAULT_DATA);

DATA_CONTEXT.displayName = 'DATA_CONTEXT';

export {
	BACK_BO_LINKS_OR_CONDITION_OPTIONS,
	BO_LINKS_OR_CONDITION_OPTIONS,
	DATA_CONTEXT,
	DEFAULT_DATA,
	OBJECT_OR_CONDITION_OPTIONS
};
