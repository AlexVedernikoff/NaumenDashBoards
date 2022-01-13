// @flow
import {createSchema, number, object} from 'GroupModal/schema';
import {DATETIME_SYSTEM_GROUP} from 'store/widgets/constants';
import type {LangType} from 'localization/localize_types';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const SYSTEM_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
	{
		label: 'DateGroupModal::Day',
		value: DATETIME_SYSTEM_GROUP.DAY
	},
	{
		label: 'DateGroupModal::Week',
		value: DATETIME_SYSTEM_GROUP.WEEK
	},
	{
		label: 'DateGroupModal::SevenDays',
		value: DATETIME_SYSTEM_GROUP.SEVEN_DAYS
	},
	{
		label: 'DateGroupModal::Month',
		value: DATETIME_SYSTEM_GROUP.MONTH
	},
	{
		label: 'DateGroupModal::Quarter',
		value: DATETIME_SYSTEM_GROUP.QUARTER
	},
	{
		label: 'DateGroupModal::Year',
		value: DATETIME_SYSTEM_GROUP.YEAR
	}
];

const DATETIME_SYSTEM_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
	{
		label: 'DateGroupModal::Minutes',
		value: DATETIME_SYSTEM_GROUP.MINUTES
	},
	{
		label: 'DateGroupModal::Hours',
		value: DATETIME_SYSTEM_GROUP.HOURS
	},
	...SYSTEM_OPTIONS
];

const OR_CONDITION_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
	{
		label: 'DateGroupModal::Between',
		value: OR_CONDITION_TYPES.BETWEEN
	},
	{
		label: 'DateGroupModal::Last',
		value: OR_CONDITION_TYPES.LAST
	},
	{
		label: 'DateGroupModal::Near',
		value: OR_CONDITION_TYPES.NEAR
	},
	{
		label: 'DateGroupModal::LastHours',
		value: OR_CONDITION_TYPES.LAST_HOURS
	},
	{
		label: 'DateGroupModal::NearHours',
		value: OR_CONDITION_TYPES.NEAR_HOURS
	},
	{
		label: 'DateGroupModal::Today',
		value: OR_CONDITION_TYPES.TODAY
	},
	{
		label: 'DateGroupModal::Empty',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'DateGroupModal::NotEmpty',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	}
];

type p = Array<{label: LangType, value: string}>;
type D = {[id: string]: p};

const FORMATS: D = {
	DATETIME_DAY: [
		{
			label: 'DateGroupModal::DateTimeDay::ddMM',
			value: 'dd MM'
		},
		{
			label: 'DateGroupModal::DateTimeDay::ddmmYYhhii',
			value: 'dd.mm.YY hh:ii'
		},
		{
			label: 'DateGroupModal::DateTimeDay::ddmmYYhh',
			value: 'dd.mm.YY hh'
		},
		{
			label: 'DateGroupModal::DateTimeDay::ddmmYY',
			value: 'dd.mm.YY'
		},
		{
			label: 'DateGroupModal::DateTimeDay::WD',
			value: 'WD'
		},
		{
			label: 'DateGroupModal::DateTimeDay::dd',
			value: 'dd'
		}
	],
	DAY: [
		{
			label: 'DateGroupModal::DateTimeDay::ddMM',
			value: 'dd MM'
		},
		{
			label: 'DateGroupModal::DateTimeDay::ddmmYY',
			value: 'dd.mm.YY'
		},
		{
			label: 'DateGroupModal::DateTimeDay::WD',
			value: 'WD'
		},
		{
			label: 'DateGroupModal::DateTimeDay::dd',
			value: 'dd'
		}
	],
	HOURS: [
		{
			label: 'DateGroupModal::DateTimeDay::hh',
			value: 'hh'
		},
		{
			label: 'DateGroupModal::DateTimeDay::hhii',
			value: 'hh:ii'
		}
	],
	MINUTES: [
		{
			label: 'DateGroupModal::DateTimeDay::ii',
			value: 'ii'
		}
	],
	MONTH: [
		{
			label: 'DateGroupModal::DateTimeDay::MM',
			value: 'MM'
		},
		{
			label: 'DateGroupModal::DateTimeDay::MMYY',
			value: 'MM YY'
		}
	],
	QUARTER: [
		{
			label: 'DateGroupModal::DateTimeDay::QQ',
			value: 'QQ'
		},
		{
			label: 'DateGroupModal::DateTimeDay::QQYY',
			value: 'QQ YY'
		}
	],
	SEVEN_DAYS: [
		{
			label: 'DateGroupModal::DateTimeDay::7D',
			value: 'dd mm - dd mm'
		}
	],
	WEEK: [
		{
			label: 'DateGroupModal::DateTimeDay::WW',
			value: 'ww'
		},
		{
			label: 'DateGroupModal::DateTimeDay::WWYY',
			value: 'WW YY'
		}
	],
	YEAR: [
		{
			label: 'DateGroupModal::DateTimeDay::YYYY',
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
