// @flow
import {DATETIME_SYSTEM_GROUP} from 'store/widgets/constants';
import {OPERAND_TYPES} from 'store/customGroups/constants';

const SYSTEM_OPTIONS = [
	{
		label: 'День',
		value: DATETIME_SYSTEM_GROUP.DAY
	},
	{
		label: 'Неделя',
		value: DATETIME_SYSTEM_GROUP.WEEK
	},
	{
		label: '7 дней',
		value: DATETIME_SYSTEM_GROUP.SEVEN_DAYS
	},
	{
		label: 'Месяц',
		value: DATETIME_SYSTEM_GROUP.MONTH
	},
	{
		label: 'Квартал',
		value: DATETIME_SYSTEM_GROUP.QUARTER
	},
	{
		label: 'Год',
		value: DATETIME_SYSTEM_GROUP.YEAR
	}
];

const CUSTOM_OPTIONS = [
	{
		label: 'с ...по',
		value: OPERAND_TYPES.BETWEEN
	},
	{
		label: 'за последние "n" дней ',
		value: OPERAND_TYPES.LAST
	},
	{
		label: 'в ближайшие "n" дней',
		value: OPERAND_TYPES.NEAR
	},
	{
		label: 'сегодня',
		value: OPERAND_TYPES.TODAY
	}
];

export {
	CUSTOM_OPTIONS,
	SYSTEM_OPTIONS
};
