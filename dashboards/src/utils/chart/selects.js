// @flow
import {CHART_VARIANTS} from './constants';

const AXIS_SELECTS = [
	{
		label: 'Столбчатая диаграмма',
		value: CHART_VARIANTS.COLUMN
	},
	{
		label: 'Столбчатая c накоплением',
		value: CHART_VARIANTS.COLUMN_STACKED
	},
	{
		label: 'Линейная диаграмма',
		value: CHART_VARIANTS.LINE
	}
];

const AXIS_HORIZONTAL_SELECTS = [
	{
		label: 'Гистограмма',
		value: CHART_VARIANTS.BAR
	},
	{
		label: 'Гистограмма c накоплением',
		value: CHART_VARIANTS.BAR_STACKED
	}
];

const CIRCLE_SELECTS = [
	{
		label: 'Круговая диаграмма',
		value: CHART_VARIANTS.PIE
	},
	{
		label: 'Кольцевая диаграмма',
		value: CHART_VARIANTS.DONUT
	}
];

const COMBO_SELECT = {
	label: 'Комбинированная диаграмма',
	value: CHART_VARIANTS.COMBO
};

const CHART_SELECTS = {
	AXIS_SELECTS,
	AXIS_HORIZONTAL_SELECTS,
	CIRCLE_SELECTS,
	COMBO_SELECT
};

export {
	CHART_SELECTS
};
