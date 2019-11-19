// @flow
import {
	Bar,
	BarStacked,
	Column,
	ColumnStacked,
	Combo,
	Donut,
	Line,
	Pie,
	Summary,
	Table
} from 'icons/widgets';
import {CHART_VARIANTS} from 'utils/chart/constants';
import {WIDGET_VARIANTS} from 'utils/widget';
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

const WIDGETS = [
	{
		label: Column,
		value: CHART_VARIANTS.COLUMN
	},
	{
		label: ColumnStacked,
		value: CHART_VARIANTS.COLUMN_STACKED
	},
	{
		label: Bar,
		value: CHART_VARIANTS.BAR
	},
	{
		label: BarStacked,
		value: CHART_VARIANTS.BAR_STACKED
	},
	{
		label: Line,
		value: CHART_VARIANTS.LINE
	},
	{
		label: Pie,
		value: CHART_VARIANTS.PIE
	},
	{
		label: Donut,
		value: CHART_VARIANTS.DONUT
	},
	{
		label: Combo,
		value: CHART_VARIANTS.COMBO
	},
	{
		label: Summary,
		value: WIDGET_VARIANTS.SUMMARY
	},
	{
		label: Table,
		value: WIDGET_VARIANTS.TABLE
	}
];

const CHARTS = [
	{
		label: Column,
		value: CHART_VARIANTS.COLUMN
	},
	{
		label: ColumnStacked,
		value: CHART_VARIANTS.COLUMN_STACKED
	},
	{
		label: Line,
		value: CHART_VARIANTS.LINE
	}
];

const OPTIONS = {
	CHARTS,
	DATETIME_GROUPS,
	DEFAULT_AGGREGATIONS,
	DEFAULT_GROUPS,
	INTEGER_AGGREGATIONS,
	LEGEND_POSITIONS,
	WIDGETS
};

export default OPTIONS;
