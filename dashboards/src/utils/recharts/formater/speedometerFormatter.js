// @flow
import {checkNumber, makeFormatterByNumberFormat, oldFormatMSInterval} from './helpers';
import {DEFAULT_NUMBER_AXIS_FORMAT} from 'store/widgets/data/constants';
import {getMainDataSet} from 'store/widgets/data/helpers';
import {hasMSInterval} from 'store/widgets/helpers';
import {INTEGER_AGGREGATION} from 'store/widgets/constants';
import type {NumberFormatter, SpeedometerFormatter} from './types';
import type {SpeedometerWidget} from 'store/widgets/data/types';

/**
 * Создает форматер для итогового значения на спидометре
 * @param {SpeedometerWidget} widget - виджет
 * @returns {NumberFormatter}
 */
const getTotalFormatter = (widget: SpeedometerWidget): NumberFormatter => {
	const {data, indicator} = widget;
	const {computedFormat, format} = indicator;
	const mainDataSet = getMainDataSet(data);
	const {aggregation, attribute} = mainDataSet.indicators[0];
	const usesMSInterval = hasMSInterval(attribute, aggregation);
	let formatter = null;

	if (usesMSInterval) {
		formatter = oldFormatMSInterval;
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
 * @returns {NumberFormatter}
 */
const getBordersFormatter = (widget: SpeedometerWidget): NumberFormatter => {
	const {format} = widget.borders.style;
	const numberFormat = format ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const formatter = checkNumber(makeFormatterByNumberFormat(numberFormat, false));

	return formatter;
};

/**
 * Создает форматер для значений в легенде или значений размещенных на дуге
 * @param {SpeedometerWidget} widget - виджет
 * @returns {NumberFormatter}
 */
const getRangesFormatter = (widget: SpeedometerWidget): NumberFormatter => {
	const {format} = widget.ranges.style;
	const numberFormat = format ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const formatter = checkNumber(makeFormatterByNumberFormat(numberFormat, false));

	return formatter;
};

/**
 * Фабрика форматеров для диаграммы спидометра
 * @param {SpeedometerWidget} widget - виджет
 * @returns {SpeedometerFormatter} - объект с функциями форматерами
 */
const getSpeedometerFormatterBase = (widget: SpeedometerWidget): SpeedometerFormatter => ({
	borders: getBordersFormatter(widget),
	ranges: getRangesFormatter(widget),
	total: getTotalFormatter(widget)
});

export {getSpeedometerFormatterBase as getSpeedometerFormatter};
