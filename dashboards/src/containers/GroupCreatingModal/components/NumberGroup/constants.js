// @flow
import {OPERAND_TYPES} from 'store/customGroups/constants';

const CUSTOM_OPTIONS = [
	{
		label: 'равно',
		value: OPERAND_TYPES.EQUAL
	},
	{
		label: 'не равно (и не пусто)',
		value: OPERAND_TYPES.NOT_EQUAL
	},
	{
		label: 'не равно (включая пустые)',
		value: OPERAND_TYPES.NOT_EQUAL_NOT_EMPTY
	},
	{
		label: 'больше',
		value: OPERAND_TYPES.GREATER
	},
	{
		label: 'менее',
		value: OPERAND_TYPES.LESS
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
