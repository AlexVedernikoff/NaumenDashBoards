// @flow
import {createSchema, number, object} from 'GroupModal/schema';
import {DATETIME_SYSTEM_GROUP} from 'store/widgets/constants';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

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

const DATETIME_SYSTEM_OPTIONS = [
	{
		label: 'Минуты',
		value: DATETIME_SYSTEM_GROUP.MINUTES
	},
	{
		label: 'Часы',
		value: DATETIME_SYSTEM_GROUP.HOURS
	},
	...SYSTEM_OPTIONS
];

const OR_CONDITION_OPTIONS = [
	{
		label: 'с ...по',
		value: OR_CONDITION_TYPES.BETWEEN
	},
	{
		label: 'за последние "n" дней ',
		value: OR_CONDITION_TYPES.LAST
	},
	{
		label: 'в ближайшие "n" дней',
		value: OR_CONDITION_TYPES.NEAR
	},
	{
		label: 'сегодня',
		value: OR_CONDITION_TYPES.TODAY
	}
];

const FORMATS = {
	DATETIME_DAY: [
		{
			label: 'ДД ММ (1 января)',
			value: 'dd MM'
		},
		{
			label: 'ДД.ММ.ГГГГ чч:мм (01.01.2020 11:11)',
			value: 'dd.mm.YY hh:ii'
		},
		{
			label: 'ДД.ММ.ГГГГ чч (01.01.2020, 11ч)',
			value: 'dd.mm.YY hh'
		},
		{
			label: 'ДД.MM.ГГГГ (01.01.2020)',
			value: 'dd.mm.YY'
		},
		{
			label: 'День недели (понедельник)',
			value: 'WD'
		},
		{
			label: 'День месяца (1-й)',
			value: 'dd'
		}
	],
	DAY: [
		{
			label: 'ДД ММ (1 января)',
			value: 'dd MM'
		},
		{
			label: 'ДД.MM.ГГГГ (01.01.2020)',
			value: 'dd.mm.YY'
		},
		{
			label: 'День недели (понедельник)',
			value: 'WD'
		},
		{
			label: 'День месяца (1-й)',
			value: 'dd'
		}
	],
	HOURS: [
		{
			label: 'чч (11)',
			value: 'hh'
		},
		{
			label: 'чч:мм (11:11)',
			value: 'hh:ii'
		}
	],
	MINUTES: [
		{
			label: 'мм (15 мин)',
			value: 'ii'
		}
	],
	MONTH: [
		{
			label: 'ММ (январь)',
			value: 'MM'
		},
		{
			label: 'ММ ГГГГ (январь 2020)',
			value: 'MM YY'
		}
	],
	QUARTER: [
		{
			label: 'Квартал (1 кв-л)',
			value: 'QQ'
		},
		{
			label: 'Квартал и год (1 кв-л 2020)',
			value: 'QQ YY'
		}
	],
	SEVEN_DAYS: [
		{
			label: 'ДД ММ - ДД ММ (2 января - 8 января)',
			value: 'dd mm - dd mm'
		}
	],
	WEEK: [
		{
			label: '№ недели (1-я)',
			value: 'ww'
		},
		{
			label: 'Неделя и год (1 неделя 2020)',
			value: 'WW YY'
		}
	],
	YEAR: [
		{
			label: 'ГГГГ (2020)',
			value: 'yyyy'
		}
	]
};

const SCHEMA = createSchema((condition: OrCondition) => {
	const {BETWEEN, LAST, NEAR} = OR_CONDITION_TYPES;

	switch (condition.type) {
		case BETWEEN:
			return object().between();
		case LAST:
		case NEAR:
			return number().isInteger();
	}
});

export {
	DATETIME_SYSTEM_OPTIONS,
	FORMATS,
	OR_CONDITION_OPTIONS,
	SCHEMA,
	SYSTEM_OPTIONS
};
