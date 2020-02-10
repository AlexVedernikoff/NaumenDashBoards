// @flow
import {CONDITION_TYPES} from 'store/customGroups/constants';

const DATETIME_OPTIONS = [
	{
		label: 'с ...по',
		value: CONDITION_TYPES.BETWEEN
	},
	{
		label: 'за последние "n" дней ',
		value: CONDITION_TYPES.LAST
	},
	{
		label: 'в ближайшие "n" дней',
		value: CONDITION_TYPES.NEAR
	},
	{
		label: 'сегодня',
		value: CONDITION_TYPES.TODAY
	}
];

const INTEGER_OPTIONS = [
	{
		label: 'равно',
		value: CONDITION_TYPES.EQUAL
	},
	{
		label: 'не равно (и не пусто)',
		value: CONDITION_TYPES.NOT_EQUAL
	},
	{
		label: 'не равно (включая пустые)',
		value: CONDITION_TYPES.NOT_EQUAL_NOT_EMPTY
	},
	{
		label: 'больше',
		value: CONDITION_TYPES.GREATER
	},
	{
		label: 'менее',
		value: CONDITION_TYPES.LESS
	},
	{
		label: 'пусто',
		value: CONDITION_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: CONDITION_TYPES.NOT_EMPTY
	}
];

export {
	DATETIME_OPTIONS,
	INTEGER_OPTIONS
};
