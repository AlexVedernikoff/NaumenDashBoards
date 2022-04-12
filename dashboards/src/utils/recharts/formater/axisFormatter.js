// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_NUMBER_AXIS_FORMAT} from 'store/widgets/data/constants';
import type {AxisFormatter, CTXValue, NumberFormatter, ValueFormatter} from './types';
import type {AxisWidget, NumberAxisFormat} from 'store/widgets/data/types';
import {
	checkInfinity,
	checkZero,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	sevenDaysFormatter,
	storedFormatter,
	totalPercentFormatter
} from './helpers';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getDefaultFormatForAttribute, getMainDataSet} from 'store/widgets/data/helpers';
import {hasCountPercent, hasMSInterval, hasPercent, isStackedChart, parseMSInterval} from 'store/widgets/helpers';
import memoize from 'memoize-one';

/**
 * Создает форматер для блока легенды
 * @param {AxisWidget} widget - виджет
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {ValueFormatter} - функция-форматер
 */
const getLegendFormatter = (widget: AxisWidget, container: HTMLDivElement): ValueFormatter => {
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
 * @param {() => number} totalCalculator -  расчет общего количества элементов на диаграмме
 * @param {boolean} checkShowEmptyData - указывает на необходимость показывать скрытые данные
 * @param {boolean} checkPercentAggregation - указывает на необходимость добавлять % по умолчанию, при процентной агрегации
 * @returns {ValueFormatter} - функция-форматер
 */
const getDataFormatter = (
	widget: AxisWidget,
	format: NumberAxisFormat,
	totalCalculator: (() => number) | null,
	checkShowEmptyData: boolean,
	checkPercentAggregation: boolean = true
): NumberFormatter => {
	const dataSet = getMainDataSet(widget.data);
	const {breakdown, indicators, parameters, showEmptyData} = dataSet;
	const {aggregation, attribute: indicatorAttribute} = indicators[0];
	const usesMSInterval = hasMSInterval(indicatorAttribute, aggregation);
	const usesPercent = checkPercentAggregation && hasPercent(indicatorAttribute, aggregation);
	const usesCntPercent = hasCountPercent(indicatorAttribute, aggregation);
	const {CUSTOM} = GROUP_WAYS;
	const hasCustomGroup = parameters[0].group.way === CUSTOM || breakdown?.[0].group.way === CUSTOM;
	const showZero = checkShowEmptyData && hasCustomGroup && showEmptyData;
	let formatter = null;

	if (usesMSInterval) {
		formatter = parseMSInterval;
	} else {
		const numberFormat = !format.additional && format.additional !== '' && usesPercent ? {...format, additional: '%'} : format;

		formatter = makeFormatterByNumberFormat(numberFormat);

		if (usesCntPercent && totalCalculator != null) {
			const total = totalCalculator();

			if (total !== 0) {
				formatter = totalPercentFormatter(formatter, total);
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
 * Создает оболочку для синхронизации значений подсказок и значений на графике
 * @param {AxisWidget} widget - виджет
 * @returns {Function} - функция-нормализатор
 */
const getTooltipNormalizer = (widget: AxisWidget): ((number) => number) => {
	const dataSet = getMainDataSet(widget.data);
	const {indicators} = dataSet;
	const {aggregation, attribute: indicatorAttribute} = indicators[0];
	const stacked = isStackedChart(widget.type);
	const usesPercent = hasPercent(indicatorAttribute, aggregation);

	if (stacked && usesPercent) {
		const calculatePercent = memoize((value: number, dataPointIndex: number, series: Array<Array<number | ?string>>): number => {
			const fullSum = series.reduce((sm, row) => {
				const rowVal = row[dataPointIndex];
				let parsedValue = 0;

				if (typeof rowVal === 'number') {
					parsedValue = rowVal;
				} else if (typeof rowVal === 'string') {
					parsedValue = Number.parseFloat(rowVal);
				}

				return sm + parsedValue;
			}, 0);
			return value / fullSum * 100;
		});

		return (value: number, ctx: CTXValue): number => {
			const {dataPointIndex, series} = ctx;
			return calculatePercent(value, dataPointIndex, series);
		};
	}

	return (value: number) => value;
};

/**
 * Фабрика форматеров для осевой диаграммы
 * @param {AxisWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @param {() => number} totalCalculator - расчет общего количества элементов на диаграмме
 * @returns {AxisFormatter} - объект с функциями форматерами и параметрами построения
 */
const getAxisFormatterBase = (
	widget: AxisWidget,
	labels: Array<string> | Array<number>,
	container: HTMLDivElement,
	totalCalculator: () => number
): AxisFormatter => {
	const {dataLabels} = widget;
	const categoryFormatter = getCategoryFormatter(widget);
	const dataLabelsFormat = dataLabels.format ?? dataLabels.computedFormat ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const normalizedDataLabelsFormat = dataLabelsFormat && dataLabelsFormat.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT
		? dataLabelsFormat
		: DEFAULT_NUMBER_AXIS_FORMAT;
	const indicatorsFormat = {...DEFAULT_NUMBER_AXIS_FORMAT, symbolCount: null};

	return {
		dataLabel: getDataFormatter(widget, normalizedDataLabelsFormat, totalCalculator, true, true),
		indicator: getDataFormatter(widget, indicatorsFormat, null, false, false),
		legend: getLegendFormatter(widget, container),
		parameter: categoryFormatter,
		tooltip: compose(getDataFormatter(widget, normalizedDataLabelsFormat, totalCalculator, false, true), getTooltipNormalizer(widget))

	};
};

/**
 * Оболочка для getAxisFormatterBase, предназначенная для сохранения отформатированных значений в блок и вывода его в консоль.
 * Нужна для формирования тест-кейсов по виджетам
 * @param {AxisWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @param {() => number} totalCalculator - расчет общего количества элементов на диаграмме
 * @returns {AxisFormatter} - объект с функциями форматерами и параметрами построения
 */
// eslint-disable-next-line no-unused-vars
const getAxisFormatterDebug = (
	widget: AxisWidget,
	labels: Array<string> | Array<number>,
	container: HTMLDivElement,
	totalCalculator: () => number
): AxisFormatter => {
	const {clientWidth} = container;
	const store = {container: {clientWidth}, labels, widget};
	const baseFormatter = getAxisFormatterBase(widget, labels, container, totalCalculator);
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
