// @flow
import {COMBO_TYPES} from 'store/widgets/data/constants';
import {createAxisDataSet} from 'store/widgetForms/axisChartForm/helpers';
import type {DataSet, State} from './types';
import {fixIndicatorsAgregationDataSet} from 'store/widgetForms/helpers';
import {omit} from 'helpers';
import type {Values as AxisChartValues} from 'store/widgetForms/axisChartForm/types';
import type {Values as CircleChartValues} from 'store/widgetForms/circleChartForm/types';
import type {Values as TableValues} from 'store/widgetForms/tableForm/types';
import type {Values as SpeedometerValues} from 'store/widgetForms/speedometerForm/types';
import type {Values as SummaryValues} from 'store/widgetForms/summaryForm/types';

/**
 * Создает базовый объект данных комбо-графика
 * @param {string} dataKey - ключ объекта данных
 * @returns {DataSet}
 */
const createComboDataSet = (dataKey: string): DataSet => ({
	...createAxisDataSet(dataKey),
	type: COMBO_TYPES.COLUMN
});

/**
 * Изменяет значения формы комба-графика относительно изменений в форме осевых графиков
 * @param {State} state - состояние формы комба-графика
 * @param {AxisChartValues} values - значения формы осевых графиков
 * @returns {State}
 */
const changeValuesByAxisChart = (state: State, values: AxisChartValues): State => {
	const {indicator} = state;
	const {
		colorsSettings,
		computedAttrs,
		data,
		dataLabels,
		displayMode,
		header,
		legend,
		name,
		navigation,
		parameter,
		showTotalAmount,
		sorting,
		templateName
	} = values;

	return {
		colorsSettings,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createComboDataSet(dataSet.dataKey);

			return {...prevDataSet, ...dataSet};
		}),
		dataLabels: omit(dataLabels, 'format'),
		displayMode,
		header,
		indicator,
		legend,
		name,
		navigation,
		parameter: omit(parameter, 'format'),
		showTotalAmount,
		sorting,
		templateName
	};
};

/**
 * Изменяет значения формы комба-графика относительно изменений в форме круговых графиков
 * @param {State} state - состояние формы комба-графика
 * @param {CircleChartValues} values - значения формы круговых графиков
 * @returns {State}
 */
const changeValuesByCircleChart = (state: State, values: CircleChartValues): State => {
	const {
		colorsSettings,
		computedAttrs,
		data,
		dataLabels,
		displayMode,
		header,
		legend,
		name,
		navigation,
		showTotalAmount,
		templateName
	} = values;

	return {
		...state,
		colorsSettings,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createComboDataSet(dataSet.dataKey);

			return {...prevDataSet, ...dataSet};
		}),
		dataLabels,
		displayMode,
		header,
		legend,
		name,
		navigation,
		showTotalAmount,
		templateName
	};
};

/**
 * Изменяет значения формы комбо-графика относительно изменений в форме спидометра или сводки
 * @param {State} state - состояние формы комбо-графика
 * @param {SpeedometerValues | SummaryValues} values - значения формы спидометра или сводки
 * @returns {State}
 */
const changeValuesBySpeedometerOrSummary = (state: State, values: SpeedometerValues | SummaryValues): State => {
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
		...state,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createComboDataSet(dataSet.dataKey);

			return {...prevDataSet, ...dataSet};
		}),
		displayMode,
		header,
		name,
		navigation,
		templateName
	};
};

/**
 * Изменяет значения формы комбо-графика относительно изменений в форме таблицы
 * @param {State} state - состояние формы комбо-графика
 * @param {TableValues} values - значения формы таблицы
 * @returns {State}
 */
const changeValuesByTable = (state: State, values: TableValues): State => {
	const {
		computedAttrs,
		data,
		displayMode,
		header,
		name,
		navigation,
		showTotalAmount,
		templateName
	} = values;

	return {
		...state,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createComboDataSet(dataSet.dataKey);

			return {
				...prevDataSet,
				...fixIndicatorsAgregationDataSet(dataSet)
			};
		}),
		displayMode,
		header,
		name,
		navigation,
		showTotalAmount,
		templateName
	};
};

export {
	changeValuesByAxisChart,
	changeValuesByCircleChart,
	changeValuesBySpeedometerOrSummary,
	changeValuesByTable,
	createComboDataSet
};
