// @flow

// Набор цветов по умолчанию палитры диаграмм
const COLORS = [
	'#EA3223',
	'#999999',
	'#2C6FBA',
	'#4EAD5B',
	'#DE5D30',
	'#67369A',
	'#F6C142',
	'#4CAEEA',
	'#A1BA66',
	'#B02318',
	'#536130',
	'#DCA5A2',
	'#928A5B',
	'#9BB3D4',
	'#8C4A1C',
	'#FFFE55'
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

const VALUES = {
	COLORS,
	DATETIME_GROUP,
	DEFAULT_GROUP,
	DEFAULT_AGGREGATION,
	INTEGER_AGGREGATION
};

export default VALUES;
