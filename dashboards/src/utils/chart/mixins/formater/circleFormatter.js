// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_NUMBER_AXIS_FORMAT, TEXT_HANDLERS} from 'store/widgets/data/constants';
import {
	checkInfinity,
	cropFormatter,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	sevenDaysFormatter
} from './helpers';
import type {CircleFormatter, NumberFormatter, ValueFormatter} from './types';
import type {CircleWidget, NumberAxisFormat} from 'store/widgets/data/types';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getDefaultFormatForAttribute, getMainDataSet} from 'store/widgets/data/helpers';
import {getLegendWidth} from 'utils/chart/mixins/helpers';
import {hasMSInterval, hasPercent, parseMSInterval} from 'store/widgets/helpers';

const getDataFormatter = (widget: CircleWidget, format: NumberAxisFormat): NumberFormatter => {
	const dataSet = getMainDataSet(widget.data);
	const {indicators} = dataSet;
	const {aggregation, attribute: indicatorAttribute} = indicators[0];

	const usesMSInterval = hasMSInterval(indicatorAttribute, aggregation);
	const usesPercent = hasPercent(indicatorAttribute, aggregation);

	let formatter = null;

	if (usesMSInterval) {
		formatter = parseMSInterval;
	} else {
		const numberFormat = !format.additional && usesPercent ? {...format, additional: '%'} : format;

		formatter = makeFormatterByNumberFormat(numberFormat);
		formatter = checkInfinity(formatter);
	}

	return formatter;
};

const getCircleDataLabelFormatter = (formatter: NumberFormatter) => (percent, options: Object) => {
	const value = options.w.config.series[options.seriesIndex];
	return formatter(value);
};

/**
 * Создает форматер для подписей в tooltip
 * @param {CircleWidget} widget - виджет
 * @returns {NumberFormatter | ValueFormatter} - функция-форматер
 */
const getCategoryFormatter = (widget: CircleWidget): NumberFormatter | ValueFormatter => {
	const {breakdownFormat} = widget;
	const dataSet = getMainDataSet(widget.data);
	const {attribute, group} = dataSet.breakdown[0];

	if (group.way === GROUP_WAYS.SYSTEM && group.data === DATETIME_SYSTEM_GROUP.SEVEN_DAYS) {
		return sevenDaysFormatter;
	}

	return makeFormatterByFormat(breakdownFormat ?? getDefaultFormatForAttribute(attribute, group));
};

const getLegendFormatter = (widget: CircleWidget, container: HTMLDivElement): NumberFormatter | ValueFormatter => {
	let formatter = getCategoryFormatter(widget);
	const {legend} = widget;
	const {fontSize, position, textHandler} = legend;
	const length = Math.round(getLegendWidth(container, position) / fontSize);

	if (textHandler === TEXT_HANDLERS.CROP) {
		formatter = (compose(cropFormatter(length), formatter): ValueFormatter);
	}

	return formatter;
};

const getCircleFormatter = (widget: CircleWidget, labels: Array<string> | Array<number>, container: HTMLDivElement): CircleFormatter => {
	const {dataLabels} = widget;
	const dataLabelsFormat = dataLabels.format ?? dataLabels.computedFormat ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const normalizedDataLabelsFormat = dataLabelsFormat && dataLabelsFormat.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT
		? dataLabelsFormat
		: DEFAULT_NUMBER_AXIS_FORMAT;
	const dataLablesFormatter = getDataFormatter(widget, normalizedDataLabelsFormat);

	return {
		breakdown: getCategoryFormatter(widget),
		dataLabel: getCircleDataLabelFormatter(dataLablesFormatter),
		legend: getLegendFormatter(widget, container),
		tooltip: dataLablesFormatter
	};
};

export {getCircleFormatter};
