// @flow
import {DATETIME_SYSTEM_GROUP, DEFAULT_SYSTEM_GROUP} from 'store/widgets/constants';

const DEFAULT_SYSTEM_OPTIONS = [
	{
		label: 'Вкл.',
		value: DEFAULT_SYSTEM_GROUP.OVERLAP
	}
];

const DATETIME_SYSTEM_OPTIONS = [
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

export {
	DATETIME_SYSTEM_GROUP,
	DATETIME_SYSTEM_OPTIONS,
	DEFAULT_SYSTEM_GROUP,
	DEFAULT_SYSTEM_OPTIONS
};
