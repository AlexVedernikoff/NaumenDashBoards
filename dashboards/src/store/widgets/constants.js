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
const MINUTE: 'MINUTE' = 'MINUTE';
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
const ACTIVE: 'ACTIVE:' = 'ACTIVE:';
const EXCEED: 'EXCEED' = 'EXCEED';
const NOT_STARTED: 'NOT_STARTED' = 'NOT_STARTED';
const PAUSED: 'PAUSED' = 'PAUSED';
const STOPPED: 'STOPPED' = 'STOPPED';

const TIMER_SYSTEM_GROUP = {
	ACTIVE,
	NOT_STARTED,
	PAUSED,
	STOPPED
};

const BACK_TIMER_SYSTEM_GROUP = {
	...TIMER_SYSTEM_GROUP,
	EXCEED
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

export {
	BACK_TIMER_SYSTEM_GROUP,
	DATETIME_SYSTEM_GROUP,
	DEFAULT_AGGREGATION,
	DEFAULT_SYSTEM_GROUP,
	GROUP_WAYS,
	INTEGER_AGGREGATION,
	INTERVAL_SYSTEM_GROUP,
	TIMER_SYSTEM_GROUP
};
