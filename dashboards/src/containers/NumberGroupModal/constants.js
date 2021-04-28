// @flow
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS = [
	{
		label: 'равно',
		value: OR_CONDITION_TYPES.EQUAL
	},
	{
		label: 'не равно (и не пусто)',
		value: OR_CONDITION_TYPES.NOT_EQUAL
	},
	{
		label: 'не равно (включая пустые)',
		value: OR_CONDITION_TYPES.NOT_EQUAL_NOT_EMPTY
	},
	{
		label: 'больше',
		value: OR_CONDITION_TYPES.GREATER
	},
	{
		label: 'менее',
		value: OR_CONDITION_TYPES.LESS
	},
	{
		label: 'пусто',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	}
];

export {
	OR_CONDITION_OPTIONS
};
