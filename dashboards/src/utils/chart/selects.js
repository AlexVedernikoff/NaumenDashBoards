// @flow
import {Bar, BarStacked, Column, ColumnStacked, Combo, Donut, Line, Pie} from 'icons/widgets';
import {CHART_VARIANTS} from './constansts';

const AXIS_SELECTS = [
	{
		icon: Column,
		label: 'Столбчатая диаграмма',
		value: CHART_VARIANTS.COLUMN
	},
	{
		icon: ColumnStacked,
		label: 'Столбчатая c накоплением',
		value: CHART_VARIANTS.COLUMN_STACKED
	},
	{
		icon: Bar,
		label: 'Гистограмма',
		value: CHART_VARIANTS.BAR
	},
	{
		icon: BarStacked,
		label: 'Гистограмма c накоплением',
		value: CHART_VARIANTS.BAR_STACKED
	},
	{
		icon: Line,
		label: 'Линейная диаграмма',
		value: CHART_VARIANTS.LINE
	}
];

const CIRCLE_SELECTS = [
	{
		icon: Pie,
		label: 'Круговая диаграмма',
		value: CHART_VARIANTS.PIE
	},
	{
		icon: Donut,
		label: 'Кольцевая диаграмма',
		value: CHART_VARIANTS.DONUT
	}
];

const COMBO_SELECT = {
	icon: Combo,
	label: 'Комбинированная диаграмма',
	value: CHART_VARIANTS.COMBO
};

const CHART_SELECTS = {
	AXIS_SELECTS,
	CIRCLE_SELECTS,
	COMBO_SELECT
};

export {
	CHART_SELECTS
};
