// @flow
import {AXIS_FORMAT_TYPE, TEXT_HANDLERS} from 'store/widgets/data/constants';
import type {AxisWidget, NumberAxisFormat} from 'store/widgets/data/types';
import {
	checkInfinity,
	checkString,
	checkZero,
	cropFormatter,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	percentFormat,
	sevenDaysFormatter,
	splitFormatter
} from './helpers';
import {checkLabelsForOverlap, getLegendWidth} from 'utils/chart/mixins/helpers';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import type {Formatter, NumberFormatter, ValueFormatter} from './types';
import {getDefaultFormatForAttribute, getMainDataSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent, isHorizontalChart, isStackedChart, parseMSInterval} from 'store/widgets/helpers';

/**
 * Создает форматер для блока легенды
 * @param {AxisWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {NumberFormatter | ValueFormatter} - функция-форматер
 */
const getLegendFormatter = (widget: AxisWidget, container: HTMLDivElement): NumberFormatter | ValueFormatter => {
	const {legend} = widget;
	const dataSet = getMainDataSet(widget.data);
	const {breakdown, parameters} = dataSet;
	const {fontSize, position, textHandler} = legend;
	const length = Math.round(getLegendWidth(container, position) / fontSize);
	const format = Array.isArray(breakdown)
		? widget.breakdownFormat ?? getDefaultFormatForAttribute(breakdown[0].attribute, breakdown[0].group)
		: widget.parameter?.format ?? getDefaultFormatForAttribute(parameters[0].attribute, parameters[0].group);
	let formatter = makeFormatterByFormat(format);

	if (textHandler === TEXT_HANDLERS.CROP) {
		formatter = (compose(cropFormatter(length), formatter): ValueFormatter);
	}

	return formatter;
};

/**
 * Создает форматер для меток и оси индикатора
 * @param {AxisWidget} widget - виджет
 * @param {NumberAxisFormat} format - установленный пользователем формат, используется только для меток данных
 * @param {boolean} checkShowEmptyData - установленный пользователем флаг показывать скрытые данные.
 * @returns {NumberFormatter | ValueFormatter} - функция-форматер
 */
const getDataFormatter = (widget: AxisWidget, format: ?NumberAxisFormat, checkShowEmptyData?: boolean = false): NumberFormatter => {
	const dataSet = getMainDataSet(widget.data);
	const {breakdown, indicators, parameters, showEmptyData} = dataSet;
	const {aggregation, attribute: indicatorAttribute} = indicators[0];
	const usesMSInterval = hasMSInterval(indicatorAttribute, aggregation);
	const usesPercent = hasPercent(indicatorAttribute, aggregation);
	const {CUSTOM} = GROUP_WAYS;
	const hasCustomGroup = parameters[0].group.way === CUSTOM || breakdown?.[0].group.way === CUSTOM;
	const showZero = checkShowEmptyData && hasCustomGroup && showEmptyData;
	let formatter = null;

	if (usesMSInterval) {
		formatter = parseMSInterval;
	} else {
		if (format) {
			const numberFormat = !format.additional && usesPercent ? {...format, additional: '%'} : format;

			formatter = makeFormatterByNumberFormat(numberFormat);
		} else {
			formatter = (value: number) => Number.isInteger(value) ? value.toString() : value.toFixed(2);

			if (usesPercent) {
				formatter = compose(percentFormat, formatter);
			}
		}

		formatter = checkInfinity(formatter);

		if (!showZero) {
			formatter = checkZero(formatter);
		}
	}

	return formatter;
};

/**
 * Создает форматер для оси параметра
 * @param {AxisWidget} widget - виджет
 * @returns {NumberFormatter | ValueFormatter} - функция-форматер
 */
const getCategoryFormatter = (widget: AxisWidget): NumberFormatter | ValueFormatter => {
	const {parameter} = widget;
	const dataSet = getMainDataSet(widget.data);
	const {attribute, group} = dataSet.parameters[0];

	if (group.way === GROUP_WAYS.SYSTEM && group.data === DATETIME_SYSTEM_GROUP.SEVEN_DAYS) {
		return sevenDaysFormatter;
	}

	return makeFormatterByFormat(parameter.format ?? getDefaultFormatForAttribute(attribute, group));
};

/**
 * Фабрика форматеров для осевой диаграммы
 * @param {AxisWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {Formatter} - объект с функциями форматерами и параметрами построения
 */
const getAxisFormatterBase = (widget: AxisWidget, labels: Array<string> | Array<number>, container: HTMLDivElement): Formatter => {
	const {dataLabels, legend} = widget;
	const horizontal = isHorizontalChart(widget.type);
	const stacked = isStackedChart(widget.type);
	const categoryFormatter = getCategoryFormatter(widget);
	// $FlowFixMe - getCategoryFormatter должен сам разобраться что он обрабатывает.
	const formatLabels = labels.map(categoryFormatter);
	const hasOverlappedLabel = checkLabelsForOverlap(formatLabels, container, legend, horizontal);
	const dataLabelsFormat = dataLabels.format && dataLabels.format.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT ? dataLabels.format : null;
	const categoryOverlappedSplitter = checkString(splitFormatter(!hasOverlappedLabel));

	return {
		dataLabel: getDataFormatter(widget, dataLabelsFormat, true),
		indicator: getDataFormatter(widget),
		legend: getLegendFormatter(widget, container),
		options: {
			hasOverlappedLabel,
			horizontal,
			stacked
		},
		parameter: {
			default: categoryFormatter,
			overlapped: compose(categoryOverlappedSplitter, categoryFormatter)
		}
	};
};

const getAxisFormatterDebug = (widget: AxisWidget, labels: Array<string> | Array<number>, container: HTMLDivElement): Formatter => {
	const {clientWidth} = container;
	const store = {container: {clientWidth}, labels, widget};
	const baseFormatter = getAxisFormatterBase(widget, labels, container);
	const {options} = baseFormatter;
	const storedFormatter = (
		stored: Array<[string | number, string]>,
		formatter: (string => string) | (number => string)
	) =>
		(value: string | number): string => {
			// $FlowFixMe - value зависит от того какой будет formatter
			const result = formatter(value);

			stored.push([value, result]);
			return result;
		};
	const dataLabel = [];
	const indicator = [];
	const legend = [];
	const parameterDefault = [];
	const parameterOverlapped = [];

	console.info('getAxisFormatterDebug: ', {...store, dataLabel, indicator, legend, options, parameterDefault, parameterOverlapped});
	return {
		dataLabel: storedFormatter(dataLabel, baseFormatter.dataLabel),
		indicator: storedFormatter(indicator, baseFormatter.indicator),
		legend: storedFormatter(legend, baseFormatter.legend),
		options: baseFormatter.options,
		parameter: {
			default: storedFormatter(parameterDefault, baseFormatter.parameter.default),
			overlapped: storedFormatter(parameterOverlapped, baseFormatter.parameter.overlapped)
		}
	};
};

let getAxisFormatter = getAxisFormatterBase;

if (process.env.NODE_ENV === 'development' && process.env.AXIS_FORMATTER_DEBUG === 'true') {
	getAxisFormatter = getAxisFormatterDebug;
}

export {getAxisFormatter};
