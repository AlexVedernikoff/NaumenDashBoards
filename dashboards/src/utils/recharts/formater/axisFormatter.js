// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_NUMBER_AXIS_FORMAT} from 'store/widgets/data/constants';
import type {AxisFormatter, PercentStore, ValueFormatter} from './types';
import type {AxisWidget, NumberAxisFormat} from 'store/widgets/data/types';
import {
	checkInfinity,
	checkNumber,
	checkZero,
	cntPercentFormatter,
	formatMSInterval,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	sevenDaysFormatter,
	storedFormatter
} from './helpers';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getDefaultFormatForAttribute, getMainDataSet} from 'store/widgets/data/helpers';
import {hasCountPercent, hasMSInterval, hasPercent} from 'store/widgets/helpers';

/**
 * Создает форматер для блока легенды
 * @param {AxisWidget} widget - виджет
 * @returns {ValueFormatter} - функция-форматер
 */
const getLegendFormatter = (widget: AxisWidget): ValueFormatter => {
	const dataSet = getMainDataSet(widget.data);
	const {breakdown, parameters} = dataSet;
	const format = Array.isArray(breakdown)
		? widget.breakdownFormat ?? getDefaultFormatForAttribute(breakdown[0].attribute, breakdown[0].group)
		: widget.parameter?.format ?? getDefaultFormatForAttribute(parameters[0].attribute, parameters[0].group);
	const formatter = makeFormatterByFormat(format, false);

	return formatter;
};

/**
 * Создает форматер для меток и оси индикатора
 * @param {AxisWidget} widget - виджет
 * @param {NumberAxisFormat} format - установленный пользователем формат, используется только для меток данных
 * @param {PercentStore} percentStore - данные для cnt(%)
 * @param {boolean} checkShowEmptyData - указывает на необходимость показывать скрытые данные
 * @param {boolean} checkPercentAggregation - указывает на необходимость добавлять % по умолчанию, при процентной агрегации
 * @returns {ValueFormatter} - функция-форматер
 */
const getDataFormatter = (
	widget: AxisWidget,
	format: NumberAxisFormat,
	percentStore: PercentStore = {},
	checkShowEmptyData: boolean,
	checkPercentAggregation: boolean = true
): ValueFormatter => {
	const dataSet = getMainDataSet(widget.data);
	const {breakdown, indicators, parameters, showEmptyData} = dataSet;
	const {aggregation, attribute: indicatorAttribute} = indicators[0];
	const usesMSInterval = hasMSInterval(indicatorAttribute, aggregation);
	const usesPercent = checkPercentAggregation && hasPercent(indicatorAttribute, aggregation);
	const usesCntPercent = checkPercentAggregation && hasCountPercent(indicatorAttribute, aggregation);
	const {CUSTOM} = GROUP_WAYS;
	const hasCustomGroup = parameters[0].group.way === CUSTOM || breakdown?.[0].group.way === CUSTOM;
	const showZero = checkShowEmptyData && hasCustomGroup && showEmptyData;
	let formatter = null;

	if (usesMSInterval) {
		formatter = checkNumber(formatMSInterval);
	} else {
		const numberFormat = !format.additional && format.additional !== '' && usesPercent ? {...format, additional: '%'} : format;

		formatter = makeFormatterByNumberFormat(numberFormat);

		if (usesCntPercent) {
			formatter = cntPercentFormatter(formatter, percentStore);
		} else {
			formatter = checkInfinity(formatter);

			if (!showZero) {
				formatter = checkZero(formatter);
			}
		}

		formatter = checkNumber(formatter);
	}

	return formatter;
};

/**
 * Создает форматер для оси параметра
 * @param {AxisWidget} widget - виджет
 * @returns {ValueFormatter} - функция-форматер
 */
const getCategoryFormatter = (widget: AxisWidget): ValueFormatter => {
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
 * @param {PercentStore} percentStore - данные для cnt(%)
 * @returns {AxisFormatter} - объект с функциями форматерами и параметрами построения
 */
const getAxisFormatterBase = (
	widget: AxisWidget,
	labels: Array<string> | Array<number>,
	percentStore: PercentStore = {}
): AxisFormatter => {
	const {dataLabels} = widget;
	const categoryFormatter = getCategoryFormatter(widget);
	const dataLabelsFormat = dataLabels.format ?? dataLabels.computedFormat ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const normalizedDataLabelsFormat = dataLabelsFormat && dataLabelsFormat.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT
		? dataLabelsFormat
		: DEFAULT_NUMBER_AXIS_FORMAT;
	const indicatorsFormat = {...DEFAULT_NUMBER_AXIS_FORMAT, symbolCount: null};

	return {
		dataLabel: getDataFormatter(widget, normalizedDataLabelsFormat, percentStore, true, true),
		indicator: getDataFormatter(widget, indicatorsFormat, percentStore, false, false),
		legend: getLegendFormatter(widget),
		parameter: categoryFormatter,
		tooltip: compose(getDataFormatter(widget, normalizedDataLabelsFormat, percentStore, false, true)),
		totalDataLabel: getDataFormatter(widget, normalizedDataLabelsFormat, {}, true, true)
	};
};

/**
 * Оболочка для getAxisFormatterBase, предназначенная для сохранения отформатированных значений в блок и вывода его в консоль.
 * Нужна для формирования тест-кейсов по виджетам
 * @param {AxisWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {PercentStore} percentStore - данные для cnt(%)
 * @returns {AxisFormatter} - объект с функциями форматерами и параметрами построения
 */
// eslint-disable-next-line no-unused-vars
const getAxisFormatterDebug = (
	widget: AxisWidget,
	labels: Array<string> | Array<number>,
	percentStore: PercentStore
): AxisFormatter => {
	const store = {labels, widget};
	const baseFormatter = getAxisFormatterBase(widget, labels, percentStore);
	const dataLabel = [];
	const indicator = [];
	const legend = [];
	const parameterDefault = [];
	const parameterOverlapped = [];
	const tooltipTitle = [];

	console.info('getAxisFormatterDebug: ', {...store, dataLabel, indicator, legend, parameterDefault, parameterOverlapped, tooltipTitle});
	return {
		dataLabel: storedFormatter(dataLabel, baseFormatter.dataLabel),
		indicator: storedFormatter(indicator, baseFormatter.indicator),
		legend: storedFormatter(legend, baseFormatter.legend),
		parameter: storedFormatter(parameterDefault, baseFormatter.parameter),
		tooltip: storedFormatter(parameterDefault, baseFormatter.tooltip)
	};
};

export {getAxisFormatterBase as getAxisFormatter};
