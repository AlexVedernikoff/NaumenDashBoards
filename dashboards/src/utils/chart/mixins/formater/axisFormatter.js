// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_NUMBER_AXIS_FORMAT, TEXT_HANDLERS} from 'store/widgets/data/constants';
import type {AxisFormatter, NumberFormatter, ValueFormatter} from './types';
import type {AxisWidget, NumberAxisFormat} from 'store/widgets/data/types';
import {
	checkInfinity,
	checkString,
	checkZero,
	cropFormatter,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	sevenDaysFormatter,
	splitFormatter,
	storedFormatter
} from './helpers';
import {checkLabelsForOverlap, getLegendWidth} from 'utils/chart/mixins/helpers';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
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
	let formatter = makeFormatterByFormat(format, false);

	if (textHandler === TEXT_HANDLERS.CROP) {
		formatter = (compose(cropFormatter(length), formatter): ValueFormatter);
	}

	return formatter;
};

/**
 * Создает форматер для меток и оси индикатора
 * @param {AxisWidget} widget - виджет
 * @param {NumberAxisFormat} format - установленный пользователем формат, используется только для меток данных
 * @param {boolean} checkShowEmptyData - указывает на необходимость показывать скрытые данные
 * @returns {NumberFormatter | ValueFormatter} - функция-форматер
 */
const getDataFormatter = (widget: AxisWidget, format: NumberAxisFormat, checkShowEmptyData: boolean): NumberFormatter => {
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
		const numberFormat = !format.additional && format.additional !== '' && usesPercent ? {...format, additional: '%'} : format;

		formatter = makeFormatterByNumberFormat(numberFormat);
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

	return makeFormatterByFormat(parameter.format ?? getDefaultFormatForAttribute(attribute, group), false);
};

/**
 * Фабрика форматеров для осевой диаграммы
 * @param {AxisWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {AxisFormatter} - объект с функциями форматерами и параметрами построения
 */
const getAxisFormatterBase = (widget: AxisWidget, labels: Array<string> | Array<number>, container: HTMLDivElement): AxisFormatter => {
	const {dataLabels, legend} = widget;
	const horizontal = isHorizontalChart(widget.type);
	const stacked = isStackedChart(widget.type);
	const categoryFormatter = getCategoryFormatter(widget);
	// $FlowFixMe - getCategoryFormatter должен сам разобраться что он обрабатывает.
	const formatLabels = labels.map(categoryFormatter);
	const hasOverlappedLabel = checkLabelsForOverlap(formatLabels, container, legend, horizontal);
	const dataLabelsFormat = dataLabels.format ?? dataLabels.computedFormat ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const normalizedDataLabelsFormat = dataLabelsFormat && dataLabelsFormat.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT
		? dataLabelsFormat
		: DEFAULT_NUMBER_AXIS_FORMAT;
	const indicatorsFormat = {...DEFAULT_NUMBER_AXIS_FORMAT, additional: '', symbolCount: 0};
	const categoryOverlappedSplitter = checkString(splitFormatter(!hasOverlappedLabel));

	return {
		dataLabel: getDataFormatter(widget, normalizedDataLabelsFormat, true),
		indicator: getDataFormatter(widget, indicatorsFormat, false),
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

/**
 * Оболочка для getAxisFormatterBase, предназначенная для сохранения отформатированных значений в блок и вывода его в консоль.
 * Нужна для формирования тест-кейсов по виджетам
 * @param {AxisWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {AxisFormatter} - объект с функциями форматерами и параметрами построения
 */
// eslint-disable-next-line no-unused-vars
const getAxisFormatterDebug = (widget: AxisWidget, labels: Array<string> | Array<number>, container: HTMLDivElement): AxisFormatter => {
	const {clientWidth} = container;
	const store = {container: {clientWidth}, labels, widget};
	const baseFormatter = getAxisFormatterBase(widget, labels, container);
	const {options} = baseFormatter;
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

export {getAxisFormatterBase as getAxisFormatter};
