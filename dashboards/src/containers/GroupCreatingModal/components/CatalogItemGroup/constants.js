// @flow
import {OPERAND_TYPES} from 'store/customGroups/constants';

const CUSTOM_OPTIONS = [
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
		label: 'Равно атрибуту текущего объекта',
		value: OPERAND_TYPES.EQUAL_ATTR_CURRENT_OBJECT
	}
];

export {
	CUSTOM_OPTIONS
};
