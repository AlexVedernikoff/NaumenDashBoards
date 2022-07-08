// @flow
import {checkNumber, formatMSInterval, makeFormatterByNumberFormat} from './helpers';
import {DEFAULT_NUMBER_AXIS_FORMAT} from 'store/widgets/data/constants';
import {getMainDataSet} from 'store/widgets/data/helpers';
import {hasMSInterval} from 'store/widgets/helpers';
import {INTEGER_AGGREGATION} from 'store/widgets/constants';
import type {NumberFormatter, SpeedometerFormatter} from './types';
import type {SpeedometerWidget} from 'store/widgets/data/types';

/**
 * Создает форматер для итогового значения на спидометре
 * @param {SpeedometerWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {NumberFormatter}
 */
const getTotalFormatter = (widget: SpeedometerWidget, container: HTMLDivElement): NumberFormatter => {
	const {data, indicator} = widget;
	const {computedFormat, format} = indicator;
	const mainDataSet = getMainDataSet(data);
	const {aggregation, attribute} = mainDataSet.indicators[0];
	const usesMSInterval = hasMSInterval(attribute, aggregation);
	let formatter = null;

	if (usesMSInterval) {
		formatter = formatMSInterval;
	} else {
		const defaultSymbolCount = aggregation === INTEGER_AGGREGATION.AVG ? 2 : 0;
		const numberFormat = format ?? computedFormat ?? {...DEFAULT_NUMBER_AXIS_FORMAT, symbolCount: defaultSymbolCount};

		formatter = checkNumber(makeFormatterByNumberFormat(numberFormat, false));
	}

	return formatter;
};

/**
 * Создает форматер для граничных значений на спидометре
 * @param {SpeedometerWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {NumberFormatter}
 */
const getBordersFormatter = (widget: SpeedometerWidget, container: HTMLDivElement): NumberFormatter => {
	const {format} = widget.borders.style;
	const numberFormat = format ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const formatter = checkNumber(makeFormatterByNumberFormat(numberFormat, false));

	return formatter;
};

/**
 * Создает форматер для значений в легенде или значений размещенных на дуге
 * @param {SpeedometerWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {NumberFormatter}
 */
const getRangesFormatter = (widget: SpeedometerWidget, container: HTMLDivElement): NumberFormatter => {
	const {format} = widget.ranges.style;
	const numberFormat = format ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const formatter = checkNumber(makeFormatterByNumberFormat(numberFormat, false));

	return formatter;
};

/**
 * Фабрика форматеров для диаграммы спидометра
 * @param {SpeedometerWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {SpeedometerFormatter} - объект с функциями форматерами
 */
const getSpeedometerFormatterBase = (widget: SpeedometerWidget, container: HTMLDivElement): SpeedometerFormatter => ({
	borders: getBordersFormatter(widget, container),
	ranges: getRangesFormatter(widget, container),
	total: getTotalFormatter(widget, container)
});

export {getSpeedometerFormatterBase as getSpeedometerFormatter};
