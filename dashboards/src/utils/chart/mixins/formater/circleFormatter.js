// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_NUMBER_AXIS_FORMAT, TEXT_HANDLERS} from 'store/widgets/data/constants';
import {
	checkInfinity,
	checkNumber,
	cropFormatter,
	getTooltipTitlePruner,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	sevenDaysFormatter,
	storedFormatter
} from './helpers';
import type {CircleFormatter, NumberFormatter, ValueFormatter} from './types';
import type {CircleWidget, NumberAxisFormat} from 'store/widgets/data/types';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, DEFAULT_AGGREGATION, GROUP_WAYS} from 'store/widgets/constants';
import {getDefaultFormatForAttribute, getMainDataSet} from 'store/widgets/data/helpers';
import {getLegendWidth} from 'utils/chart/mixins/helpers';
import {hasMSInterval, hasPercent, parseMSInterval} from 'store/widgets/helpers';
import {LEGEND_POSITIONS} from 'utils/chart/constants';

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

const getCircleDataLabelFormatter = (formatter: NumberFormatter, showPercent: boolean) => {
	let innerFormatter: (value: number, percent?: number) => string = formatter;

	if (showPercent) {
		const percentFormatter = checkNumber(makeFormatterByNumberFormat({
			additional: '%',
			symbolCount: null,
			type: AXIS_FORMAT_TYPE.NUMBER_FORMAT
		}));

		innerFormatter = (value: number, percent?: number) => {
			const resultValue = formatter(value);
			const percentValue = percentFormatter(percent);
			return `${resultValue} (${percentValue})`;
		};
	}

	return (percent, options: Object) => {
		const value = options.w.config.series[options.seriesIndex];
		return innerFormatter(value, percent);
	};
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

	return makeFormatterByFormat(breakdownFormat ?? getDefaultFormatForAttribute(attribute, group), false);
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

/**
 * Фабрика форматеров для круговой диаграммы
 * @param {CircleWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {CircleFormatter} - объект с функциями форматерами и параметрами построения
 */
const getCircleFormatterBase = (widget: CircleWidget, labels: Array<string> | Array<number>, container: HTMLDivElement): CircleFormatter => {
	const {dataLabels, legend} = widget;
	const dataSet = getMainDataSet(widget.data);
	const {position, show} = legend;
	const horizontalsLegendShow = show && (position === LEGEND_POSITIONS.left || position === LEGEND_POSITIONS.right);
	const dataLabelsFormat = dataLabels.format ?? dataLabels.computedFormat ?? DEFAULT_NUMBER_AXIS_FORMAT;
	const normalizedDataLabelsFormat = dataLabelsFormat && dataLabelsFormat.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT
		? dataLabelsFormat
		: DEFAULT_NUMBER_AXIS_FORMAT;
	const categoryFormatter = getCategoryFormatter(widget);
	const legendFormatter = getLegendFormatter(widget, container);
	const doubleAggregation = dataSet.indicators?.[0]?.aggregation === DEFAULT_AGGREGATION.PERCENT_CNT;
	const dataLabelsFormatter = getDataFormatter(widget, normalizedDataLabelsFormat);
	const normalizeDataLabelsFormatter = getCircleDataLabelFormatter(dataLabelsFormatter, doubleAggregation);

	return {
		breakdown: categoryFormatter,
		dataLabel: normalizeDataLabelsFormatter,
		legend: legendFormatter,
		tooltip: {
			data: dataLabelsFormatter,
			title: compose(getTooltipTitlePruner(horizontalsLegendShow, container), categoryFormatter)
		}
	};
};

/**
 * Оболочка для getCircleFormatterBase, предназначенная для сохранения отформатированных значений в блок и вывода его в консоль.
 * Нужна для формирования тест-кейсов по виджетам
 * @param {CircleWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {CircleFormatter} - объект с функциями форматерами и параметрами построения
 */
// eslint-disable-next-line no-unused-vars
const getCircleFormatterDebug = (widget: CircleWidget, labels: Array<string> | Array<number>, container: HTMLDivElement): CircleFormatter => {
	const {clientWidth} = container;
	const store = {container: {clientWidth}, labels, widget};
	const baseFormatter = getCircleFormatterBase(widget, labels, container);
	const breakdown = [];
	const dataLabel = [];
	const legend = [];
	const tooltipData = [];
	const tooltipTitle = [];

	console.info('getCircleFormatterBase: ', {...store, breakdown, dataLabel, legend, tooltipData, tooltipTitle});
	const dataLabelCtxExtractor = ctx => {
		const {seriesIndex, w} = ctx;
		const value = w.config.series[seriesIndex];
		return {seriesIndex, w: {config: {series: {[seriesIndex]: value}}}};
	};
	return {
		breakdown: storedFormatter(breakdown, baseFormatter.breakdown),
		dataLabel: storedFormatter(dataLabel, baseFormatter.dataLabel, dataLabelCtxExtractor),
		legend: storedFormatter(legend, baseFormatter.legend),
		tooltip: {
			data: storedFormatter(tooltipData, baseFormatter.tooltip.data),
			title: storedFormatter(tooltipTitle, baseFormatter.tooltip.title)
		}
	};
};

export {getCircleFormatterBase as getCircleFormatter};
