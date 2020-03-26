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
		label: 'Не содержит (включая пустые)',
		value: OPERAND_TYPES.NOT_CONTAINS_INCLUDING_EMPTY
	},
	{
		label: 'пусто',
		value: OPERAND_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OPERAND_TYPES.NOT_EMPTY
	}
];

export {
	CUSTOM_OPTIONS
};
