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
import {CHART_VARIANTS, LEGEND_POSITIONS as LP} from 'utils/chart/constants';
import {WIDGET_VARIANTS} from 'utils/widget/constants';

// Расположения легенды
const LEGEND_POSITIONS = [
	{value: LP.right, label: 'Справа'},
	{value: LP.left, label: 'Слева'},
	{value: LP.top, label: 'Вверху'},
	{value: LP.bottom, label: 'Внизу'}
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
	LEGEND_POSITIONS,
	WIDGETS
};

export default OPTIONS;
