// @flow
// Агрегация
const AVG: 'AVG' = 'AVG';
const COUNT: 'COUNT_CNT' = 'COUNT_CNT';
const MAX: 'MAX' = 'MAX';
const MIN: 'MIN' = 'MIN';
const PERCENT: 'PERCENT' = 'PERCENT';
const SUM: 'SUM' = 'SUM';

const DEFAULT_AGGREGATION = {
	COUNT,
	PERCENT
};

const INTEGER_AGGREGATION = {
	AVG,
	MAX,
	MIN,
	SUM
};

const DEFAULT_AGGREGATION_OPTIONS = [
	{
		label: 'CNT',
		value: DEFAULT_AGGREGATION.COUNT
	},
	{
		label: '%',
		value: DEFAULT_AGGREGATION.PERCENT
	}
];

const INTEGER_AGGREGATION_OPTIONS = [
	{
		label: 'SUM',
		value: INTEGER_AGGREGATION.SUM
	},
	{
		label: 'AVG',
		value: INTEGER_AGGREGATION.AVG
	},
	{
		label: 'MAX',
		value: INTEGER_AGGREGATION.MAX
	},
	{
		label: 'MIN',
		value: INTEGER_AGGREGATION.MIN
	}
];

// Группировка
const DAY: 'DAY' = 'DAY';
const MONTH: 'MONTH' = 'MONTH';
const ON: 'ON' = 'ON';
const SEVEN: 'SEVEN' = 'SEVEN';
const QUARTER: 'QUARTER' = 'QUARTER';
const SEVEN_DAYS: 'SEVEN_DAYS' = 'SEVEN_DAYS';
const WEEK: 'WEEK' = 'WEEK';
const YEAR: 'YEAR' = 'YEAR';

const OVERLAP: 'OVERLAP' = 'OVERLAP';

const DATETIME_GROUP = {
	DAY,
	MONTH,
	ON,
	SEVEN,
	QUARTER,
	SEVEN_DAYS,
	WEEK,
	YEAR
};

const DEFAULT_GROUP = {
	OVERLAP
};

const DEFAULT_GROUP_OPTIONS = [
	{
		label: 'Вкл.',
		value: DEFAULT_GROUP.OVERLAP
	}
];

const DATETIME_GROUP_OPTIONS = [
	{
		label: 'День',
		value: DATETIME_GROUP.DAY
	},
	{
		label: 'Неделя',
		value: DATETIME_GROUP.WEEK
	},
	{
		label: '7 дней',
		value: DATETIME_GROUP.SEVEN_DAYS
	},
	{
		label: 'Месяц',
		value: DATETIME_GROUP.MONTH
	},
	{
		label: 'Квартал',
		value: DATETIME_GROUP.QUARTER
	},
	{
		label: 'Год',
		value: DATETIME_GROUP.YEAR
	}
];

// Типы кнопок
const AGGREGATION: 'aggregation' = 'aggregation';
const COMPUTE: 'compute' = 'compute';
const GROUP: 'group' = 'group';

const TYPES = {
	AGGREGATION,
	COMPUTE,
	GROUP
};

export {
	DATETIME_GROUP,
	DATETIME_GROUP_OPTIONS,
	DEFAULT_AGGREGATION,
	DEFAULT_AGGREGATION_OPTIONS,
	DEFAULT_GROUP,
	DEFAULT_GROUP_OPTIONS,
	INTEGER_AGGREGATION,
	INTEGER_AGGREGATION_OPTIONS,
	TYPES
};
