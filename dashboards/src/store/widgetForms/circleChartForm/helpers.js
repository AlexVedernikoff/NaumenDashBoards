// @flow
import {compose} from 'redux';
import type {DataSet, State} from './types';
import {DEFAULT_INDICATOR, DEFAULT_SOURCE} from 'store/widgetForms/constants';
import {DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {
	fixClearIndicatorsFormat,
	fixIndicatorsAggregationDataSet,
	fixLeaveOneIndicator,
	fixRemoveParameters,
	getDefaultBreakdown
} from 'store/widgetForms/helpers';
import {omit} from 'helpers';
import type {Values as TableValues} from 'store/widgetForms/tableForm/types';
import type {Values as AxisValues} from 'src/store/widgetForms/axisChartForm/types';
import type {Values as ComboValues} from 'src/store/widgetForms/comboChartForm/types';
import type {Values as SpeedometerValues} from 'src/store/widgetForms/speedometerForm/types';
import type {Values as SummaryValues} from 'src/store/widgetForms/summaryForm/types';
import type {Values as PivotValues} from 'store/widgetForms/pivotForm/types';

/**
 * Создает базовый объект данных кругового графика
 * @param {string} dataKey - ключ объекта данных
 * @returns {DataSet}
 */
const createCircleDataSet = (dataKey: string): DataSet => ({
	__type: 'CIRCLE_DATA_SET',
	breakdown: getDefaultBreakdown(dataKey),
	dataKey,
	indicators: [DEFAULT_INDICATOR],
	showBlankData: false,
	showEmptyData: false,
	source: DEFAULT_SOURCE,
	sourceForCompute: false,
	top: DEFAULT_TOP_SETTINGS
});

/**
 * Изменяет значения формы круговых графиков относительно изменений в форме осевых графиков или комбо-графика
 * @param {State} state - состояние формы круговых графиков
 * @param {AxisValues | ComboValues} values - значения формы осевых графиков или комбо-графика
 * @returns {State}
 */
const changeValuesByAxisOrComboChart = (state: State, values: AxisValues | ComboValues): State => {
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
		templateName,
		tooltip
	} = values;

	return {
		...state,
		colorsSettings,
		computedAttrs,
		data: data.map(dataSet => {
			const {
				breakdown,
				dataKey,
				indicators,
				showBlankData,
				showEmptyData,
				source,
				sourceForCompute,
				top
			} = dataSet;

			return {
				__type: 'CIRCLE_DATA_SET',
				breakdown: sourceForCompute ? [] : (breakdown ?? getDefaultBreakdown(dataKey)),
				dataKey,
				indicators: fixClearIndicatorsFormat(indicators),
				showBlankData,
				showEmptyData,
				source,
				sourceForCompute,
				top
			};
		}),
		dataLabels: omit(dataLabels, 'format'),
		displayMode,
		header,
		legend,
		name,
		navigation,
		showTotalAmount,
		templateName,
		tooltip
	};
};

/**
 * Изменяет значения формы круговых графиков относительно изменений в форме спидометра или сводки
 * @param {State} state - состояние формы круговых графиков
 * @param {AxisValues | ComboValues} values - значения формы спидометра или сводки
 * @returns {State}
 */
const changeValuesBySpeedometerOrSummary = (
	state: State,
	values: SpeedometerValues | SummaryValues
): State => {
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
		...state,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createCircleDataSet(dataSet.dataKey);
			return {...prevDataSet, ...dataSet, __type: 'CIRCLE_DATA_SET'};
		}),
		displayMode,
		header,
		name,
		navigation,
		templateName,
		tooltip
	};
};

/**
 * Изменяет значения формы круговых графиков относительно изменений в форме таблицы
 * @param {State} state - состояние формы круговых графиков
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
		templateName,
		tooltip
	} = values;
	const transformDataSet = compose(
		fixLeaveOneIndicator,
		fixIndicatorsAggregationDataSet,
		fixRemoveParameters
	);

	return {
		...state,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createCircleDataSet(dataSet.dataKey);
			const fixDataSet = transformDataSet(dataSet);

			return {...prevDataSet, ...fixDataSet};
		}),
		displayMode,
		header,
		name,
		navigation,
		templateName,
		tooltip
	};
};

/**
 * Изменяет значения формы осевых графиков относительно изменений в форме сводке
 * @param {State} state - состояние формы осевых графиков
 * @param {TableValues} values - значения формы сводки
 * @returns {State}
 */
const changeValuesByPivot = (state: State, values: PivotValues): State => {
	const {
		data,
		displayMode,
		header,
		name,
		navigation,
		templateName,
		tooltip
	} = values;
	const transformDataSet = compose(
		fixLeaveOneIndicator,
		fixIndicatorsAggregationDataSet,
		fixRemoveParameters
	);

	return {
		...state,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createCircleDataSet(dataSet.dataKey);
			const fixDataSet = transformDataSet(dataSet);

			return {...prevDataSet, ...fixDataSet};
		}),
		displayMode,
		header,
		name,
		navigation,
		templateName,
		tooltip
	};
};

export {
	createCircleDataSet,
	changeValuesByAxisOrComboChart,
	changeValuesBySpeedometerOrSummary,
	changeValuesByPivot,
	changeValuesByTable
};
