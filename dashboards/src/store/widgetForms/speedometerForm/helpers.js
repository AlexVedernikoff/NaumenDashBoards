// @flow
import {compose} from 'redux';
import type {DataSet, State} from './types';
import {DEFAULT_INDICATOR, DEFAULT_SOURCE} from 'store/widgetForms/constants';
import {fixIndicatorsAggregation, fixIndicatorsTooltip, fixPivotIndicators} from 'store/widgetForms/helpers';
import type {Values as AxisChartValues} from 'store/widgetForms/axisChartForm/types';
import type {Values as CircleChartValues} from 'src/store/widgetForms/circleChartForm/types';
import type {Values as ComboChartValues} from 'src/store/widgetForms/comboChartForm/types';
import type {Values as TableValues} from 'src/store/widgetForms/tableForm/types';
import type {Values as SummaryValues} from 'src/store/widgetForms/summaryForm/types';
import type {Values as PivotValues} from 'store/widgetForms/pivotForm/types';

/**
 * Создает базовый объект данных спидометра
 * @param {string} dataKey - ключ объекта данных
 * @returns {DataSet}
 */
const createSpeedometerDataSet = (dataKey: string): DataSet => ({
	__type: 'SPEEDOMETER_DATA_SET',
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
const changeValues = (state: State, values: AxisChartValues | CircleChartValues | ComboChartValues | TableValues | SummaryValues | PivotValues): State => {
	const {borders, indicator, parameter, ranges} = state;
	const {
		computedAttrs,
		data,
		displayMode,
		header,
		name,
		navigation,
		templateName,
		tooltip
	} = values;

	return {
		borders,
		computedAttrs,
		data: data.map(dataSet => {
			const {dataKey, indicators, source, sourceForCompute} = dataSet;
			const transformIndicators = compose(
				fixPivotIndicators,
				fixIndicatorsAggregation,
				fixIndicatorsTooltip(tooltip?.show ?? false)
			);

			return {
				__type: 'SPEEDOMETER_DATA_SET',
				dataKey,
				indicators: transformIndicators(indicators).slice(0, 1),
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
		templateName,
		tooltip
	};
};

export {
	changeValues,
	createSpeedometerDataSet
};
