// @flow
import {DATETIME_VARIANTS, INTERVAL_VARIANTS} from './constansts';

const DATETIME_SELECTS = [
	{
		label: 'По дням',
		value: DATETIME_VARIANTS.DAY
	},
	{
		label: 'По неделям',
		value: DATETIME_VARIANTS.WEEK
	},
	{
		label: 'По месяцам',
		value: DATETIME_VARIANTS.MONTH
	},
	{
		label: 'По кварталам',
		value: DATETIME_VARIANTS.QUARTER
	},
	{
		label: 'По годам',
		value: DATETIME_VARIANTS.YEAR
	}
];

const INTERVAL_SELECTS = [
	{
		label: 'По минутам',
		value: INTERVAL_VARIANTS.INTERVAL_MINUTE
	},
	{
		label: 'По часам',
		value: INTERVAL_VARIANTS.INTERVAL_HOUR
	},
	{
		label: 'По дням',
		value: INTERVAL_VARIANTS.INTERVAL_DAY
	},
	{
		label: 'По месяцам',
		value: INTERVAL_VARIANTS.INTERVAL_MONTH
	}
];

const GROUP_SELECTS = {
	DATETIME_SELECTS,
	INTERVAL_SELECTS
};

export {
	GROUP_SELECTS
};
