// @flow

// Способы создания группировок
const CUSTOM: 'CUSTOM' = 'CUSTOM';
const SYSTEM: 'SYSTEM' = 'SYSTEM';

const GROUP_WAYS = {
	CUSTOM,
	SYSTEM
};

// Типы группировок
const DATETIME: 'DATETIME' = 'DATETIME';
const INTEGER: 'INTEGER' = 'INTEGER';

const GROUP_TYPES = {
	DATETIME,
	INTEGER
};

// Типы системных группировок
const DAY: 'DAY' = 'DAY';
const MONTH: 'MONTH' = 'MONTH';
const ON: 'ON' = 'ON';
const SEVEN: 'SEVEN' = 'SEVEN';
const QUARTER: 'QUARTER' = 'QUARTER';
const SEVEN_DAYS: 'SEVEN_DAYS' = 'SEVEN_DAYS';
const WEEK: 'WEEK' = 'WEEK';
const YEAR: 'YEAR' = 'YEAR';

const OVERLAP: 'OVERLAP' = 'OVERLAP';

const DATETIME_SYSTEM_GROUP = {
	DAY,
	MONTH,
	ON,
	QUARTER,
	SEVEN,
	SEVEN_DAYS,
	WEEK,
	YEAR
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
	DATETIME_SYSTEM_GROUP,
	DEFAULT_AGGREGATION,
	DEFAULT_SYSTEM_GROUP,
	GROUP_TYPES,
	GROUP_WAYS,
	INTEGER_AGGREGATION
};
