// @flow
import {compose} from 'redux';
import type {DataSet, State} from './types';
import {DEFAULT_COMPARE_PERIOD} from 'store/widgets/data/constants';
import {DEFAULT_INDICATOR, DEFAULT_SOURCE} from 'store/widgetForms/constants';
import {fixIndicatorsAggregation, fixPivotIndicators} from 'store/widgetForms/helpers';
import type {Values as AxisChartValues} from 'store/widgetForms/axisChartForm/types';
import type {Values as CircleChartValues} from 'store/widgetForms/circleChartForm/types';
import type {Values as ComboChartValues} from 'store/widgetForms/comboChartForm/types';
import type {Values as SpeedometerValues} from 'store/widgetForms/speedometerForm/types';
import type {Values as TableValues} from 'store/widgetForms/tableForm/types';
import type {Values as PivotValues} from 'store/widgetForms/pivotForm/types';

/**
 * Создает базовый объект данных сводки
 * @param {string} dataKey - ключ объекта данных
 * @returns {DataSet}
 */
const createSummaryDataSet = (dataKey: string): DataSet => ({
	__type: 'SUMMARY_DATA_SET',
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
const changeValues = (state: State, values: AxisChartValues | CircleChartValues | ComboChartValues | PivotValues | TableValues | SpeedometerValues): State => {
	const {indicator} = state;
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
		comparePeriod: DEFAULT_COMPARE_PERIOD,
		computedAttrs,
		data: data.map(dataSet => {
			const {dataKey, indicators, source, sourceForCompute} = dataSet;
			const transformIndicators = compose(fixPivotIndicators, fixIndicatorsAggregation);

			return {
				__type: 'SUMMARY_DATA_SET',
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
		templateName,
		tooltip
	};
};

export {
	changeValues,
	createSummaryDataSet
};
