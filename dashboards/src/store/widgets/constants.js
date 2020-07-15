// @flow

// Способы создания группировок
const CUSTOM: 'CUSTOM' = 'CUSTOM';
const SYSTEM: 'SYSTEM' = 'SYSTEM';

const GROUP_WAYS = {
	CUSTOM,
	SYSTEM
};

// Типы системных группировок
const DAY: 'DAY' = 'DAY';
const HOUR: 'HOUR' = 'HOUR';
const HOURS: 'HOURS' = 'HOURS';
const MINUTE: 'MINUTE' = 'MINUTE';
const MINUTES: 'MINUTES' = 'MINUTES';
const MONTH: 'MONTH' = 'MONTH';
const SEVEN: 'SEVEN' = 'SEVEN';
const QUARTER: 'QUARTER' = 'QUARTER';
const OVERLAP: 'OVERLAP' = 'OVERLAP';
const SECOND: 'SECOND' = 'SECOND';
const SEVEN_DAYS: 'SEVEN_DAYS' = 'SEVEN_DAYS';
const WEEK: 'WEEK' = 'WEEK';
const YEAR: 'YEAR' = 'YEAR';

// Дата
const DATETIME_SYSTEM_GROUP = {
	DAY,
	HOURS,
	MINUTES,
	MONTH,
	QUARTER,
	SEVEN,
	SEVEN_DAYS,
	WEEK,
	YEAR
};

// Интервал
const INTERVAL_SYSTEM_GROUP = {
	DAY,
	HOUR,
	MINUTE,
	SECOND,
	WEEK
};

// Счетчик
const ACTIVE: 'ACTIVE' = 'ACTIVE';
const EXCEED: 'EXCEED' = 'EXCEED';
const NOT_EXCEED: 'NOT_EXCEED' = 'NOT_EXCEED';
const NOT_STARTED: 'NOT_STARTED' = 'NOT_STARTED';
const PAUSED: 'PAUSED' = 'PAUSED';
const STOPPED: 'STOPPED' = 'STOPPED';

const TIMER_STATUSES = {
	ACTIVE,
	NOT_STARTED,
	PAUSED,
	STOPPED
};

const BACK_TIMER_EXCEED_STATUSES = {
	EXCEED,
	NOT_EXCEED
};

const DEFAULT_SYSTEM_GROUP = {
	OVERLAP
};

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

// Периоды атрибута типа dtInterval
const INTERVALS = [
	{
		label: 'c',
		max: 60000,
		min: 1000
	},
	{
		label: 'мин',
		max: 36e5,
		min: 60000
	},
	{
		label: 'ч',
		max: 864e5,
		min: 36e5
	},
	{
		label: 'д',
		max: 6048e5,
		min: 864e5
	},
	{
		label: 'нед',
		max: Infinity,
		min: 6048e5
	}
];

export {
	BACK_TIMER_EXCEED_STATUSES,
	DATETIME_SYSTEM_GROUP,
	DEFAULT_AGGREGATION,
	DEFAULT_SYSTEM_GROUP,
	GROUP_WAYS,
	INTEGER_AGGREGATION,
	INTERVAL_SYSTEM_GROUP,
	INTERVALS,
	TIMER_STATUSES
};
