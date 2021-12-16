// @flow
import {DISPLAY_MODE} from './data/constants';

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
const NOT_APPLICABLE: 'NOT_APPLICABLE' = 'NOT_APPLICABLE';
const PERCENT: 'PERCENT' = 'PERCENT';
const SUM: 'SUM' = 'SUM';

const DEFAULT_AGGREGATION = {
	COUNT,
	NOT_APPLICABLE,
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
		label: 'store::widgets::Seconds',
		max: 60000,
		min: 1000
	},
	{
		label: 'store::widgets::Minutes',
		max: 36e5,
		min: 60000
	},
	{
		label: 'store::widgets::Hours',
		max: 864e5,
		min: 36e5
	},
	{
		label: 'store::widgets::Days',
		max: 6048e5,
		min: 864e5
	},
	{
		label: 'store::widgets::Weeks',
		max: Infinity,
		min: 6048e5
	}
];

// Режимы отображения виджета
const DISPLAY_MODE_OPTIONS = [
	{
		label: 'store::widgets::Web',
		value: DISPLAY_MODE.WEB
	},
	{
		label: 'store::widgets::Any',
		value: DISPLAY_MODE.ANY
	},
	{
		label: 'store::widgets::Mobile',
		value: DISPLAY_MODE.MOBILE
	}
];

export {
	BACK_TIMER_EXCEED_STATUSES,
	DATETIME_SYSTEM_GROUP,
	DEFAULT_AGGREGATION,
	DEFAULT_SYSTEM_GROUP,
	DISPLAY_MODE_OPTIONS,
	GROUP_WAYS,
	INTEGER_AGGREGATION,
	INTERVAL_SYSTEM_GROUP,
	INTERVALS,
	TIMER_STATUSES
};
