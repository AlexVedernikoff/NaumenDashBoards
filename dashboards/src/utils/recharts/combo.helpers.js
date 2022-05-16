// @flow
import {calculateYAxisNumberWidth, getAutoColor, getNiceScale, getRechartAxisSetting} from './helpers';
import type {Chart, ComboWidget} from 'store/widgets/data/types';
import type {ComboAxisOptions, ComboSeriesInfo} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';

/**
 * Рассчитывает максимальное значение оси для источника с накоплением
 * @param {string} dataKey - ключ источника
 * @param {Array<object>} series - значения индикаторов
 * @returns {number} - максимальное значение по источнику
 */
const getRangeStacked = (dataKey: string, series: Array<Object>) => {
	const result = [];

	series.forEach(row => {
		if (row.dataKey === dataKey) {
			row.data.forEach((val, i) => {
				result[i] = (result[i] ?? 0) + parseFloat(val);
			});
		}
	});
	return Math.max(...result);
};

/**
 * Рассчитывает максимальное значение оси для источника без накопления
 * @param {string} dataKey - ключ источника
 * @param {Array<object>} series - значения индикаторов
 * @returns {number} - максимальное значение по источнику
 */
const getRangeSeries = (dataKey: string, series: Array<Object>) => {
	const data = [];

	series.forEach(row => {
		if (row.dataKey === dataKey) {
			row.data.forEach(val => data.push(Number.parseFloat(val)));
		}
	});

	return Math.max(...data);
};

/**
 * Устанавливает у всех осей максимальное значение на осях
 * @param {Array<ComboAxisOptions>} axises - оси
 */
const makeDependedYAxis = (axises: Array<ComboAxisOptions>) => {
	let maxValue = 0;
	let maxWidth = 0;

	axises.forEach(axis => {
		if (axis.max > maxValue) {
			maxValue = axis.max;
			maxWidth = axis.width;
		}
	});

	axises.forEach(axis => {
		axis.max = maxValue;
		axis.width = maxWidth;
	});
};

/**
 * Формирует информацию о рядах данных для осевых диаграмм в комбо диаграмме
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные
 * @param {GlobalCustomChartColorsSettings} globalColorsSettings - глобальные настройки цветов
 * @returns {ComboSeriesInfo} - ряды данных комбо диаграммы
 */
const getComboSeriesInfo = (
	widget: Chart,
	data: DiagramBuildData,
	globalColorsSettings: GlobalCustomChartColorsSettings
): ComboSeriesInfo => {
	const {series} = data;
	const getColor = getAutoColor(widget.colorsSettings.auto.colors);

	const result = series.map(({dataKey = null, name, type = null}, i) => ({
		breakdownLabels: data.labels,
		color: getColor(name, i),
		getColor: getColor,
		key: dataKey ?? name,
		label: name,
		type
	}));

	return result;
};

/**
 * Формирование настроек осей Y для комбо диаграммы
 * @param {ComboWidget} widget - виджет
 * @param {DiagramBuildData} data - данные
 * @param {ComboSeriesInfo} series - данные по источникам
 * @returns {Array<ComboAxisOptions>} - настройки осей Y
 */
const getYAxisesNumber = (
	widget: ComboWidget,
	data: DiagramBuildData,
	series: ComboSeriesInfo
): Array<ComboAxisOptions> => {
	const result = [];
	const {max, min, showDependent} = widget.indicator;
	const settings = getRechartAxisSetting(widget.indicator);
	const colors = {};

	series.forEach(({color, key}) => { colors[key] = color; });

	widget.data.forEach(dataSet => {
		if (!dataSet.sourceForCompute) {
			const {dataKey, type, yAxisName} = dataSet;
			const isStacked = type === 'COLUMN_STACKED';
			let dataSetMax = max;

			if (dataSetMax == null) {
				dataSetMax = isStacked ? getRangeStacked(dataKey, data.series) : getRangeSeries(dataKey, data.series);
			}

			const niceValue = getNiceScale(dataSetMax * 1.25);
			const width = calculateYAxisNumberWidth(niceValue.toString(), settings, yAxisName);

			result.push({
				...settings,
				axisName: yAxisName,
				color: isStacked ? '#000' : colors[dataKey],
				dataKey,
				max: niceValue,
				min: min || 0,
				width
			});
		}
	});

	if (showDependent) {
		makeDependedYAxis(result);
	}

	return result;
};

export {
	getComboSeriesInfo,
	getYAxisesNumber
};
