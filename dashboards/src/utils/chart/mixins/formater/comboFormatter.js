// @flow

import {
	checkInfinity,
	checkString,
	checkZero,
	cropFormatter,
	makeFormatterByFormat,
	percentFormat,
	sevenDaysFormatter,
	splitFormatter
} from './helpers';
import {checkLabelsForOverlap, getLegendWidth} from 'utils/chart/mixins/helpers';
import type {ComboFormatter, ComboNumberFormatter, ComboValueFormatter, NumberFormatter, ValueFormatter} from './types';
import type {ComboWidget} from 'store/widgets/data/types';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getDefaultFormatForAttribute, getMainDataSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent, isHorizontalChart, isStackedChart, parseMSInterval} from 'store/widgets/helpers';
import {TEXT_HANDLERS} from 'store/widgets/data/constants';

const getDataKeyFromContext = (ctx: Object) => {
	const {seriesIndex, w} = ctx;
	const {series} = w.config;

	return series[seriesIndex].dataKey;
};

const oldValueToNumberFormatter = (value: ?number): string => {
	if (typeof value === 'number') {
		const fixed = Number.isInteger(value) ? 0 : 2;

		return value.toFixed(fixed);
	}

	return '';
};

const oldValueFormatter = (usesPercent: boolean, showZero: boolean) => {
	let formatter = oldValueToNumberFormatter;

	if (usesPercent) {
		formatter = compose(percentFormat, formatter);
	}

	formatter = checkInfinity(formatter);

	if (!showZero) {
		formatter = checkZero(formatter);
	}

	return formatter;
};

const getDataFormatters = (widget: ComboWidget, checkShowEmptyData?: boolean = false): ComboNumberFormatter => {
	const formatters = {};

	widget.data.forEach((dataSet) => {
		const {breakdown, dataKey, indicators, parameters, showEmptyData, sourceForCompute} = dataSet;

		if (!sourceForCompute) {
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
				formatter = oldValueFormatter(usesPercent, showZero);
			}

			formatters[dataKey] = formatter;
		}
	});

	return (value: number, ctx: Object) => {
		const key = getDataKeyFromContext(ctx);
		return formatters[key](value);
	};
};

const getCategoryFormatter = (widget: ComboWidget): NumberFormatter | ValueFormatter => {
	const {parameter} = widget;
	const dataSet = getMainDataSet(widget.data);
	const {attribute, group} = dataSet.parameters[0];

	if (group.way === GROUP_WAYS.SYSTEM && group.data === DATETIME_SYSTEM_GROUP.SEVEN_DAYS) {
		return sevenDaysFormatter;
	}

	return makeFormatterByFormat(parameter.format ?? getDefaultFormatForAttribute(attribute, group), false);
};

const getLegendFormatter = (widget: ComboWidget, container: HTMLDivElement, crop: boolean): ComboNumberFormatter | ComboValueFormatter => {
	const {legend} = widget;
	const {fontSize, position, textHandler} = legend;
	const length = Math.round(getLegendWidth(container, position) / fontSize);
	const formatters = {};

	widget.data.forEach((dataSet) => {
		const {breakdown, dataKey, parameters, sourceForCompute} = dataSet;

		if (!sourceForCompute) {
			const format = Array.isArray(breakdown)
				? widget.breakdownFormat ?? getDefaultFormatForAttribute(breakdown[0].attribute, breakdown[0].group)
				: widget.parameter?.format ?? getDefaultFormatForAttribute(parameters[0].attribute, parameters[0].group);
			let formatter = makeFormatterByFormat(format);

			if (crop && textHandler === TEXT_HANDLERS.CROP) {
				formatter = (compose(cropFormatter(length), formatter): ValueFormatter);
			}

			formatters[dataKey] = formatter;
		}
	});

	return (value: number | string, ctx: Object) => {
		const key = getDataKeyFromContext(ctx);
		return formatters[key](value);
	};
};

/**
 * Фабрика форматеров для комбо диаграммы
 * @param {ComboWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @returns {ComboFormatter} - объект с функциями форматерами и параметрами построения
 */
const getComboFormatterBase = (widget: ComboWidget, labels: Array<string> | Array<number>, container: HTMLDivElement): ComboFormatter => {
	const {legend} = widget;
	const horizontal = isHorizontalChart(widget.type);
	const stacked = isStackedChart(widget.type);
	const categoryFormatter = getCategoryFormatter(widget);
	// $FlowFixMe - getCategoryFormatter должен сам разобраться что он обрабатывает.
	const formatLabels = labels.map(categoryFormatter);
	const hasOverlappedLabel = checkLabelsForOverlap(formatLabels, container, legend, horizontal);
	const categoryOverlappedSplitter = checkString(splitFormatter(!hasOverlappedLabel));

	return {
		dataLabel: getDataFormatters(widget, true),
		indicator: getDataFormatters(widget),
		legend: {
			cropped: getLegendFormatter(widget, container, true),
			full: getLegendFormatter(widget, container, false)
		},
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

export {getComboFormatterBase as getComboFormatter};
