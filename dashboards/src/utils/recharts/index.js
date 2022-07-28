// @flow
import {calculateStringsSize} from 'src/utils/recharts/helpers';
import type {ChartOptions} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {EMPTY_CHART_OPTIONS} from './constants';
import getBarOptions from './bar';
import getBarStackedOptions from './bar.stacked';
import getColumnOptions from './columns';
import getColumnStackedOptions from './columns.stacked';
import getComboOptions from './combo';
import getLinesOptions from './lines';
import getPieOptions from './pie';
import getPivotOptions from './pivot';
import getSpeedometerOptions from './speedometer';
import getSummaryOptions from './summary';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import type {Widget} from 'store/widgets/data/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Функция возвращает объединенный набор базовых и типовых опций
 * @param {Widget} widget - виджет
 * @param {DiagramBuildData} data - данные графика виджета
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @param {GlobalCustomChartColorsSettings} globalColorsSettings - глобальные настройки цветов
 * @returns {ChartOptions}
 */
const getOptions = (
	widget: Widget,
	data: DiagramBuildData,
	container: HTMLDivElement,
	globalColorsSettings: GlobalCustomChartColorsSettings
): ChartOptions => {
	const {type} = widget;
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, PIVOT_TABLE, SPEEDOMETER, SUMMARY} = WIDGET_TYPES;
	let result = EMPTY_CHART_OPTIONS;

	switch (type) {
		case BAR:
			result = getBarOptions(widget, data, container, globalColorsSettings);
			break;
		case BAR_STACKED:
			result = getBarStackedOptions(widget, data, container, globalColorsSettings);
			break;
		case COLUMN:
			result = getColumnOptions(widget, data, container, globalColorsSettings);
			break;
		case COLUMN_STACKED:
			result = getColumnStackedOptions(widget, data, container, globalColorsSettings);
			break;
		case COMBO:
			result = getComboOptions(widget, data, container, globalColorsSettings);
			break;
		case DONUT:
		case PIE:
			result = getPieOptions(widget, data, container, globalColorsSettings);
			break;
		case LINE:
			result = getLinesOptions(widget, data, container, globalColorsSettings);
			break;
		case SPEEDOMETER:
			result = getSpeedometerOptions(widget, data, container, globalColorsSettings);
			break;
		case SUMMARY:
			result = getSummaryOptions(widget, data, container, globalColorsSettings);
			break;
		case PIVOT_TABLE:
			result = getPivotOptions(widget, data, container);
			break;
		default:
			break;
	}

	return result;
};

export {
	getOptions,
	calculateStringsSize
};
