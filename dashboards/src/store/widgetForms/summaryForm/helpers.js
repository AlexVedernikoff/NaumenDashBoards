// @flow
import type {DataSet, State} from './types';
import {DEFAULT_INDICATOR, DEFAULT_SOURCE} from 'store/widgetForms/constants';
import {fixIndicatorsAgregation} from 'store/widgetForms/helpers';
import type {Values as AxisChartValues} from 'store/widgetForms/axisChartForm/types';
import type {Values as CircleChartValues} from 'store/widgetForms/circleChartForm/types';
import type {Values as ComboChartValues} from 'store/widgetForms/comboChartForm/types';
import type {Values as SpeedometerValues} from 'store/widgetForms/speedometerForm/types';
import type {Values as TableValues} from 'store/widgetForms/tableForm/types';

/**
 * Создает базовый объект данных сводки
 * @param {string} dataKey - ключ объекта данных
 * @returns {DataSet}
 */
const createSummaryDataSet = (dataKey: string): DataSet => ({
	dataKey,
	indicators: [DEFAULT_INDICATOR],
	source: DEFAULT_SOURCE,
	sourceForCompute: false
});

/**
 * Изменяет значения формы сводки относительно изменений остальных форм
 * @param {State} state - состояние формы сводки
 * @param {AxisChartValues | CircleChartValues | ComboChartValues | TableValues | SpeedometerValues} values - значения остальных форм
 * @returns {State}
 */
const changeValues = (state: State, values: AxisChartValues | CircleChartValues | ComboChartValues | TableValues | SpeedometerValues): State => {
	const {indicator} = state;
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
		computedAttrs,
		data: data.map(dataSet => {
			const {dataKey, indicators, source, sourceForCompute} = dataSet;

			return {
				dataKey,
				indicators: fixIndicatorsAgregation(indicators).slice(0, 1),
				source,
				sourceForCompute
			};
		}),
		displayMode,
		header,
		indicator,
		name,
		navigation,
		templateName
	};
};

export {
	changeValues,
	createSummaryDataSet
};
