// @flow
import {INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';
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

const SYSTEM_OPTIONS = [
	{
		label: 'Секунды',
		value: INTERVAL_SYSTEM_GROUP.SECOND
	},
	{
		label: 'Минуты',
		value: INTERVAL_SYSTEM_GROUP.MINUTE
	},
	{
		label: 'Часы',
		value: INTERVAL_SYSTEM_GROUP.HOUR
	},
	{
		label: 'Дни',
		value: INTERVAL_SYSTEM_GROUP.DAY
	},
	{
		label: 'Недели',
		value: INTERVAL_SYSTEM_GROUP.WEEK
	}
];

export {
	CUSTOM_OPTIONS,
	SYSTEM_OPTIONS
};
