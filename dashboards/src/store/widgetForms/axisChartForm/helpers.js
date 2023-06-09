// @flow
import {compose} from 'redux';
import type {DataSet, State} from './types';
import {DEFAULT_INDICATOR, DEFAULT_PARAMETER, DEFAULT_SOURCE} from 'store/widgetForms/constants';
import {DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {
	fixClearIndicatorsFormat,
	fixIndicatorsAggregationDataSet,
	fixLeaveOneIndicator,
	fixLeaveOneParameters
} from 'store/widgetForms/helpers';
import type {Values as TableValues} from 'store/widgetForms/tableForm/types';
import type {Values as CircleValues} from 'store/widgetForms/circleChartForm/types';
import type {Values as ComboValues} from 'store/widgetForms/comboChartForm/types';
import type {Values as SpeedometerValues} from 'store/widgetForms/speedometerForm/types';
import type {Values as SummaryValues} from 'store/widgetForms/summaryForm/types';
import type {Values as PivotValues} from 'store/widgetForms/pivotForm/types';

/**
 * Создает базовый объект данных осевого графика
 * @param {string} dataKey - ключ объекта данных
 * @returns {DataSet}
 */
const createAxisDataSet = (dataKey: string): $Exact<DataSet> => ({
	__type: 'AXIS_DATA_SET',
	dataKey,
	indicators: [DEFAULT_INDICATOR],
	parameters: [DEFAULT_PARAMETER],
	showBlankData: false,
	showEmptyData: false,
	source: DEFAULT_SOURCE,
	sourceForCompute: false,
	top: DEFAULT_TOP_SETTINGS,
	xAxisName: '',
	yAxisName: ''
});

/**
 * Изменяет значения формы осевых графиков относительно изменений в форме круговых графиков
 * @param {State} state - состояние формы осевых графиков
 * @param {CircleValues} values - значения формы круговых графиков
 * @returns {State}
 */
const changeValuesByCircleChart = (state: State, values: CircleValues): State => {
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
		sorting,
		templateName,
		tooltip
	} = values;

	return {
		...state,
		colorsSettings,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const {
				parameters = [DEFAULT_PARAMETER],
				xAxisName = '',
				yAxisName = ''
			} = state.data[index] || {};
			const {indicators = []} = dataSet;

			return {
				...dataSet,
				__type: 'AXIS_DATA_SET',
				indicators,
				parameters,
				xAxisName,
				yAxisName
			};
		}),
		dataLabels,
		displayMode,
		header,
		legend,
		name,
		navigation,
		showTotalAmount,
		sorting,
		templateName,
		tooltip
	};
};

/**
 * Изменяет значения формы осевых графиков относительно изменений в форме комбо-графика
 * @param {State} state - состояние формы осевых графиков
 * @param {ComboValues} values - значения формы комбо-графика
 * @returns {State}
 */
const changeValuesByComboChart = (state: State, values: ComboValues): State => {
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
		sorting,
		templateName,
		tooltip
	} = values;

	const firstDataSet = data.find(ds => !ds.sourceForCompute);
	const axisDataLabel = {...dataLabels};

	if (firstDataSet?.indicators?.[0].format) {
		axisDataLabel.format = firstDataSet.indicators[0].format;
	}

	return {
		...state,
		colorsSettings,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const {type, ...rest} = dataSet;
			let result = {...rest, __type: 'AXIS_DATA_SET'};

			if (dataSet === firstDataSet) {
				result.indicators = fixClearIndicatorsFormat(result.indicators);
			} else if (!dataSet.sourceForCompute) {
				result = {
					...result,
					indicators: [DEFAULT_INDICATOR],
					parameters: [DEFAULT_PARAMETER],
					sourceForCompute: true
				};
			}

			return result;
		}),
		dataLabels: axisDataLabel,
		displayMode,
		header,
		legend,
		name,
		navigation,
		showTotalAmount,
		sorting,
		templateName,
		tooltip
	};
};

/**
 * Изменяет значения формы осевых графиков относительно изменений в форме спидометра или сводки
 * @param {State} state - состояние формы осевых графиков
 * @param {SpeedometerValues | SummaryValues} values - значения формы спидометра или сводки
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
			const prevDataSet = state.data[index] ?? createAxisDataSet(dataSet.dataKey);
			return {...prevDataSet, ...fixLeaveOneParameters(dataSet), __type: 'AXIS_DATA_SET'};
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
 * Изменяет значения формы осевых графиков относительно изменений в форме таблицы
 * @param {State} state - состояние формы осевых графиков
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
		templateName,
		tooltip
	} = values;
	const transformDataSet = compose(
		fixLeaveOneParameters,
		fixLeaveOneIndicator,
		fixIndicatorsAggregationDataSet
	);

	return {
		...state,
		computedAttrs,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createAxisDataSet(dataSet.dataKey);
			return {
				...prevDataSet,
				...transformDataSet(dataSet)
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
 * Изменяет значения формы осевых графиков относительно изменений в форме сводке
 * @param {State} state - состояние формы осевых графиков
 * @param {PivotValues} values - значения формы сводки
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
		fixLeaveOneParameters,
		fixLeaveOneIndicator,
		fixIndicatorsAggregationDataSet
	);

	return {
		...state,
		data: data.map((dataSet, index) => {
			const prevDataSet = state.data[index] ?? createAxisDataSet(dataSet.dataKey);
			const transDataSet = transformDataSet(dataSet);

			return {
				...prevDataSet,
				...transDataSet
			};
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
	changeValuesByCircleChart,
	changeValuesByComboChart,
	changeValuesByPivot,
	changeValuesBySpeedometerOrSummary,
	changeValuesByTable,
	createAxisDataSet
};
