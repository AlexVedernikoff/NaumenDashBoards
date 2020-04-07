// @flow
import {OPERAND_TYPES} from 'store/customGroups/constants';

const CUSTOM_OBJECT_OPTIONS = [
	{
		label: 'Содержит',
		value: OPERAND_TYPES.CONTAINS
	},
	{
		label: 'Не содержит',
		value: OPERAND_TYPES.NOT_CONTAINS
	},
	{
		label: 'Содержит любое из значений',
		value: OPERAND_TYPES.CONTAINS_ANY
	},
	{
		label: 'Название содержит',
		value: OPERAND_TYPES.TITLE_CONTAINS
	},
	{
		label: 'Название не содержит',
		value: OPERAND_TYPES.TITLE_NOT_CONTAINS
	},
	{
		label: 'пусто',
		value: OPERAND_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OPERAND_TYPES.NOT_EMPTY
	},
	{
		label: 'Содержит (включая архивные)',
		value: OPERAND_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Не содержит (включая архивные)',
		value: OPERAND_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Равно текущему объекту',
		value: OPERAND_TYPES.EQUAL_CURRENT_OBJECT
	},
	{
		label: 'Равно атрибуту текущего объекта',
		value: OPERAND_TYPES.EQUAL_ATTR_CURRENT_OBJECT
	}
];

const CUSTOM_BO_LINKS_OPTIONS = [
	{
		label: 'Содержит',
		value: OPERAND_TYPES.CONTAINS
	},
	{
		label: 'Не содержит',
		value: OPERAND_TYPES.NOT_CONTAINS
	},
	{
		label: 'Название содержит',
		value: OPERAND_TYPES.TITLE_CONTAINS
	},
	{
		label: 'Название не содержит',
		value: OPERAND_TYPES.TITLE_NOT_CONTAINS
	},
	{
		label: 'пусто',
		value: OPERAND_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OPERAND_TYPES.NOT_EMPTY
	},
	{
		label: 'Содержит (включая архивные)',
		value: OPERAND_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Не содержит (включая архивные)',
		value: OPERAND_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Содержит (включая вложенные)',
		value: OPERAND_TYPES.CONTAINS_INCLUDING_NESTED
	},
	{
		label: 'Содержит текущий объект',
		value: OPERAND_TYPES.CONTAINS_CURRENT_OBJECT
	},
	{
		label: 'Содержит атрибут текущего объекта',
		value: OPERAND_TYPES.CONTAINS_ATTR_CURRENT_OBJECT
	}
];

const CUSTOM_BACK_BO_LINKS_OPTIONS = [
	{
		label: 'Содержит',
		value: OPERAND_TYPES.CONTAINS
	},
	{
		label: 'Не содержит',
		value: OPERAND_TYPES.NOT_CONTAINS
	},
	{
		label: 'Название содержит',
		value: OPERAND_TYPES.TITLE_CONTAINS
	},
	{
		label: 'Название не содержит',
		value: OPERAND_TYPES.TITLE_NOT_CONTAINS
	},
	{
		label: 'пусто',
		value: OPERAND_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OPERAND_TYPES.NOT_EMPTY
	},
	{
		label: 'Содержит (включая архивные)',
		value: OPERAND_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Не содержит (включая архивные)',
		value: OPERAND_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'Содержит текущий объект',
		value: OPERAND_TYPES.CONTAINS_CURRENT_OBJECT
	},
	{
		label: 'Содержит атрибут текущего объекта',
		value: OPERAND_TYPES.CONTAINS_ATTR_CURRENT_OBJECT
	}
];

export {
	CUSTOM_OBJECT_OPTIONS,
	CUSTOM_BO_LINKS_OPTIONS,
	CUSTOM_BACK_BO_LINKS_OPTIONS
};
