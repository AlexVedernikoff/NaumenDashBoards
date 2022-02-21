// @flow
import type {DataSet, State} from './types';
import {DEFAULT_INDICATOR, DEFAULT_PARAMETER, DEFAULT_SOURCE} from 'store/widgetForms/constants';
import type {Values as AxisChartValues} from 'store/widgetForms/axisChartForm/types';
import type {Values as CircleChartValues} from 'src/store/widgetForms/circleChartForm/types';
import type {Values as ComboChartValues} from 'src/store/widgetForms/comboChartForm/types';
import type {Values as SpeedometerValues} from 'src/store/widgetForms/speedometerForm/types';
import type {Values as SummaryValues} from 'src/store/widgetForms/summaryForm/types';

/**
 * Создает базовый объект данных таблицы
 * @param {string} dataKey - ключ объекта данных
 * @param {boolean} addSourceRowName - установить sourceRowName
 * @returns {DataSet}
 */
const createTableDataSet = (dataKey: string, addSourceRowName: boolean = false): DataSet => ({
	dataKey,
	indicators: [DEFAULT_INDICATOR],
	parameters: [DEFAULT_PARAMETER],
	source: DEFAULT_SOURCE,
	sourceForCompute: false,
	sourceRowName: addSourceRowName ? '' : null
});

/**
 * Изменяет значения формы таблицы относительно изменений в форме круговых графиков
 * @param {State} state - состояние формы таблицы
 * @param {CircleChartValues} values - значения формы круговых графиков
 * @returns {State}
 */
const changeValuesByCircleChart = (state: State, values: CircleChartValues): State => {
	const {
		computedAttrs,
		data,
		displayMode,
		header,
		name,
		navigation,
		showTotalAmount,
		templateName,
		tooltip
	} = values;

	return {
		...state,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const {parameters} = state.data[index] ?? createTableDataSet(dataSet.dataKey);
			const {breakdown, dataKey, indicators, source, sourceForCompute} = dataSet;

			return {
				breakdown,
				dataKey,
				indicators,
				parameters,
				source,
				sourceForCompute
			};
		}),
		displayMode,
		header,
		name,
		navigation,
		showTotalAmount,
		templateName,
		tooltip
	};
};

/**
 * Изменяет значения формы таблицы относительно изменений в осевом и комбо-графике
 * @param {State} state - состояние формы таблицы
 * @param {AxisChartValues | AxisChartValues} values - значения форм графиков
 * @returns {State}
 */
const changeValuesByAxisOrComboCharts = (state: State, values: AxisChartValues | ComboChartValues): State => {
	const {calcTotalColumn, showBlankData, showEmptyData, sorting, table, top} = state;
	const {
		computedAttrs,
		data,
		displayMode,
		header,
		name,
		navigation,
		showTotalAmount,
		templateName,
		tooltip
	} = values;

	return {
		calcTotalColumn,
		computedAttrs,
		data: data.map(dataSet => {
			const {breakdown, dataKey, indicators, parameters, source, sourceForCompute} = dataSet;

			return {
				breakdown,
				dataKey,
				indicators,
				parameters,
				source,
				sourceForCompute
			};
		}),
		displayMode,
		header,
		name,
		navigation,
		showBlankData,
		showEmptyData,
		showTotalAmount,
		sorting,
		table,
		templateName,
		tooltip,
		top
	};
};

/**
 * Изменяет значения формы таблицы относительно изменений в спидометра или сводки
 * @param {State} state - состояние формы таблицы
 * @param {SpeedometerValues | SummaryValues} values - значения форм спидометра или сводки
 * @returns {State}
 */
const changeValuesBySpeedometerOrSummary = (state: State, values: SpeedometerValues | SummaryValues): State => {
	const {calcTotalColumn, showBlankData, showEmptyData, showTotalAmount, sorting, table, top} = state;
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
		calcTotalColumn,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const {breakdown, parameters} = state.data[index] ?? createTableDataSet(dataSet.dataKey);
			const {indicators: oldIndicators} = dataSet;
			const indicators = [];

			oldIndicators.forEach(indicator => {
				const {tooltip} = indicator;

				if (tooltip && !tooltip.show) {
					const newIndicator = {
						...indicator,
						tooltip: {show: false, title: ''}
					};
					return indicators.push(newIndicator);
				}

				indicators.push(indicator);
			});

			return {
				...dataSet,
				breakdown,
				indicators,
				parameters
			};
		}),
		displayMode,
		header,
		name,
		navigation,
		showBlankData,
		showEmptyData,
		showTotalAmount,
		sorting,
		table,
		templateName,
		tooltip,
		top
	};
};

/**
 * Проверяет, что источник вычисляется как одна строка, без применения параметров
 * @param {?DataSet} dataSet - источник
 * @returns {boolean} - возвращает true, если источник установлен и вычисляется как одна строка, иначе false
 */
const isDontUseParamsForDataSet = (dataSet: ?DataSet) => dataSet && typeof dataSet.sourceRowName === 'string';

export {
	changeValuesByCircleChart,
	changeValuesByAxisOrComboCharts,
	changeValuesBySpeedometerOrSummary,
	isDontUseParamsForDataSet,
	createTableDataSet
};
