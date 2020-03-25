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
import {LEGEND_POSITIONS as LP} from 'utils/chart/constants';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

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
		tip: 'Столбчатая',
		value: WIDGET_TYPES.COLUMN
	},
	{
		label: ColumnStacked,
		tip: 'Столбчатая c накоплением',
		value: WIDGET_TYPES.COLUMN_STACKED
	},
	{
		label: BarStacked,
		tip: 'Гистограмма c накоплением',
		value: WIDGET_TYPES.BAR_STACKED
	},
	{
		label: Bar,
		tip: 'Гистограмма',
		value: WIDGET_TYPES.BAR
	},
	{
		label: Line,
		tip: 'Линейная',
		value: WIDGET_TYPES.LINE
	},
	{
		label: Pie,
		tip: 'Круговая',
		value: WIDGET_TYPES.PIE
	},
	{
		label: Donut,
		tip: 'Кольцевая',
		value: WIDGET_TYPES.DONUT
	},
	{
		label: Combo,
		tip: 'Комбо',
		value: WIDGET_TYPES.COMBO
	},
	{
		label: Summary,
		tip: 'Сводка',
		value: WIDGET_TYPES.SUMMARY
	},
	{
		label: Table,
		tip: 'Таблица',
		value: WIDGET_TYPES.TABLE
	}
];

const CHARTS = [
	{
		label: Column,
		value: WIDGET_TYPES.COLUMN
	},
	{
		label: ColumnStacked,
		value: WIDGET_TYPES.COLUMN_STACKED
	},
	{
		label: Line,
		value: WIDGET_TYPES.LINE
	}
];

const OPTIONS = {
	CHARTS,
	LEGEND_POSITIONS,
	WIDGETS
};

export default OPTIONS;
