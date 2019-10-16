// @flow
import {DATETIME_VARIANTS, DEFAULT_VARIANTS, INTERVAL_VARIANTS} from './constansts';

const DATETIME_SELECTS = [
	{
		label: 'День',
		value: DATETIME_VARIANTS.DAY
	},
	{
		label: 'Неделя',
		value: DATETIME_VARIANTS.WEEK
	},
	{
		label: '7 дней',
		value: DATETIME_VARIANTS.SEVEN_DAYS
	},
	{
		label: 'Месяц',
		value: DATETIME_VARIANTS.MONTH
	},
	{
		label: 'Квартал',
		value: DATETIME_VARIANTS.QUARTER
	},
	{
		label: 'Год',
		value: DATETIME_VARIANTS.YEAR
	}
];

const DEFAULT_SELECTS = [
	{
		label: 'Совпадения',
		value: DEFAULT_VARIANTS.OVERLAP
	}
];

const INTERVAL_SELECTS = [
	{
		label: 'Минуты',
		value: INTERVAL_VARIANTS.INTERVAL_MINUTE
	},
	{
		label: 'Часы',
		value: INTERVAL_VARIANTS.INTERVAL_HOUR
	},
	{
		label: 'Дни',
		value: INTERVAL_VARIANTS.INTERVAL_DAY
	},
	{
		label: 'Месяцы',
		value: INTERVAL_VARIANTS.INTERVAL_MONTH
	}
];

const GROUP_SELECTS = {
	DATETIME_SELECTS,
	DEFAULT_SELECTS,
	INTERVAL_SELECTS
};

export {
	GROUP_SELECTS
};
