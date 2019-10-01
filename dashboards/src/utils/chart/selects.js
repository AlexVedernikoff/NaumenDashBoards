// @flow
import {CHART_VARIANTS} from './constansts';

const CHART_SELECTS = [
	{
		label: 'Столбчатая диаграмма',
		value: CHART_VARIANTS.BAR
	},
	{
		label: 'Линейная диаграмма',
		value: CHART_VARIANTS.LINE
	},
	{
		label: 'Круговая диаграмма',
		value: CHART_VARIANTS.PIE
	},
	{
		label: 'Кольцевая диаграмма',
		value: CHART_VARIANTS.DONUT
	},
	{
		label: 'Комбинированная диаграмма',
		value: CHART_VARIANTS.COMBO
	}
];

export {
	CHART_SELECTS
};
