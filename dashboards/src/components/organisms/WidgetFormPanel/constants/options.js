// @flow
import VALUES from './values';

const {DATETIME_GROUP, DEFAULT_GROUP, DEFAULT_AGGREGATION, INTEGER_AGGREGATION} = VALUES;

// Расположения легенды
const LEGEND_POSITIONS = [
	{value: 'right', label: 'Справа'},
	{value: 'left', label: 'Слева'},
	{value: 'top', label: 'Вверху'},
	{value: 'bottom', label: 'Внизу'}
];

// Группировки
const DATETIME_GROUPS = [
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

const DEFAULT_GROUPS = [
	{
		label: 'Вкл.',
		value: DEFAULT_GROUP.OVERLAP
	}
];

// Агрегация
const DEFAULT_AGGREGATIONS = [
	{
		label: 'CNT',
		value: DEFAULT_AGGREGATION.COUNT
	},
	{
		label: '%',
		value: DEFAULT_AGGREGATION.PERCENT
	}
];

const INTEGER_AGGREGATIONS = [
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

const OPTIONS = {
	DATETIME_GROUPS,
	DEFAULT_AGGREGATIONS,
	DEFAULT_GROUPS,
	INTEGER_AGGREGATIONS,
	LEGEND_POSITIONS
};

export default OPTIONS;
