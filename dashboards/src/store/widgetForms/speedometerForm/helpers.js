// @flow
import type {DataSet, State} from './types';
import {DEFAULT_INDICATOR, DEFAULT_SOURCE} from 'store/widgetForms/constants';
import {fixIndicatorsAgregation} from 'store/widgetForms/helpers';
import type {Values as AxisChartValues} from 'store/widgetForms/axisChartForm/types';
import type {Values as CircleChartValues} from 'src/store/widgetForms/circleChartForm/types';
import type {Values as ComboChartValues} from 'src/store/widgetForms/comboChartForm/types';
import type {Values as TableValues} from 'src/store/widgetForms/tableForm/types';
import type {Values as SummaryValues} from 'src/store/widgetForms/summaryForm/types';

/**
 * Создает базовый объект данных спидометра
 * @param {string} dataKey - ключ объекта данных
 * @returns {DataSet}
 */
const createSpeedometerDataSet = (dataKey: string): DataSet => ({
	dataKey,
	indicators: [DEFAULT_INDICATOR],
	source: DEFAULT_SOURCE,
	sourceForCompute: false
});

/**
 * Изменяет значения формы спидометра относительно изменений остальных форм
 * @param {State} state - состояние формы спидометра
 * @param {AxisChartValues | CircleChartValues | ComboChartValues | TableValues | SummaryValues} values - значения остальных форм
 * @returns {State}
 */
const changeValues = (state: State, values: AxisChartValues | CircleChartValues | ComboChartValues | TableValues | SummaryValues): State => {
	const {borders, indicator, parameter, ranges} = state;
	const {
		computedAttrs,
		data,
		displayMode,
		header,
		name,
		navigation,
		templateName
	} = values;

	return {
		borders,
		computedAttrs,
		data: data.map(dataSet => {
			const {dataKey, indicators, source, sourceForCompute} = dataSet;

			return {
				dataKey,
				indicators: fixIndicatorsAgregation(indicators),
				source,
				sourceForCompute
			};
		}),
		displayMode,
		header,
		indicator,
		name,
		navigation,
		parameter,
		ranges,
		templateName
	};
};

export {
	changeValues,
	createSpeedometerDataSet
};
