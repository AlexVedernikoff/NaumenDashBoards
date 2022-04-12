// @flow
import {
	checkInfinity,
	checkZero,
	makeFormatterByFormat,
	percentFormat,
	sevenDaysFormatter,
	totalPercentFormatter
} from './helpers';
import type {ComboFormatter, ComboNumberFormatter, ComboValueFormatter, ValueFormatter} from './types';
import type {ComboWidget} from 'store/widgets/data/types';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getDefaultFormatForAttribute, getMainDataSet} from 'store/widgets/data/helpers';
import {hasCountPercent, hasMSInterval, hasPercent, parseMSInterval} from 'store/widgets/helpers';

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

const getDataFormatters = (
	widget: ComboWidget,
	checkShowEmptyData: boolean,
	totalCalculator: ((dataKey: string) => number) | null
): ComboNumberFormatter => {
	const formatters = {};

	widget.data.forEach(dataSet => {
		const {breakdown, dataKey, indicators, parameters, showEmptyData, sourceForCompute} = dataSet;

		if (!sourceForCompute) {
			const {aggregation, attribute: indicatorAttribute} = indicators[0];
			const usesMSInterval = hasMSInterval(indicatorAttribute, aggregation);
			const usesPercent = hasPercent(indicatorAttribute, aggregation);
			const usesCountPercent = hasCountPercent(indicatorAttribute, aggregation);
			const {CUSTOM} = GROUP_WAYS;
			const hasCustomGroup = parameters[0].group.way === CUSTOM || breakdown?.[0].group.way === CUSTOM;
			const showZero = checkShowEmptyData && hasCustomGroup && showEmptyData;
			let formatter = null;

			if (usesMSInterval) {
				formatter = parseMSInterval;
			} else {
				formatter = oldValueFormatter(usesPercent, showZero);

				if (totalCalculator !== null && usesCountPercent) {
					const total = totalCalculator(dataKey);

					formatter = totalPercentFormatter(formatter, total);
				}
			}

			formatters[dataKey] = formatter;
		}
	});

	return (dataKey: string) => {
		const formatter = formatters[dataKey];
		return (value: number) => formatter(value);
	};
};

const getCategoryFormatter = (widget: ComboWidget): ValueFormatter => {
	const {parameter} = widget;
	const dataSet = getMainDataSet(widget.data);
	const {attribute, group} = dataSet.parameters[0];

	if (group.way === GROUP_WAYS.SYSTEM && group.data === DATETIME_SYSTEM_GROUP.SEVEN_DAYS) {
		return sevenDaysFormatter;
	}

	return makeFormatterByFormat(parameter.format ?? getDefaultFormatForAttribute(attribute, group), false);
};

const getLegendFormatter = (widget: ComboWidget, container: HTMLDivElement, crop: boolean): ComboValueFormatter => {
	const formatters = {};

	widget.data.forEach(dataSet => {
		const {breakdown, dataKey, parameters, sourceForCompute} = dataSet;

		if (!sourceForCompute) {
			const format = Array.isArray(breakdown)
				? widget.breakdownFormat ?? getDefaultFormatForAttribute(breakdown[0].attribute, breakdown[0].group)
				: widget.parameter?.format ?? getDefaultFormatForAttribute(parameters[0].attribute, parameters[0].group);
			const formatter = makeFormatterByFormat(format);

			formatters[dataKey] = formatter;
		}
	});

	return (dataKey: string) => {
		const formatter = formatters[dataKey];
		return (value: number | string) => formatter(value);
	};
};

/**
 * Фабрика форматеров для комбо диаграммы
 * @param {ComboWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {HTMLDivElement} container - контейнер отрисовки виджета
 * @param {() => number} totalCalculator -  расчет общего количества элементов на диаграмме
 * @returns {ComboFormatter} - объект с функциями форматерами и параметрами построения
 */
const getComboFormatterBase = (
	widget: ComboWidget,
	labels: Array<string> | Array<number>,
	container: HTMLDivElement,
	totalCalculator: (dataKey: string) => number
): ComboFormatter => {
	const categoryFormatter = getCategoryFormatter(widget);
	const indicatorFormatter = getDataFormatters(widget, false, null);

	return {
		dataLabel: getDataFormatters(widget, true, totalCalculator),
		indicator: indicatorFormatter,
		legend: getLegendFormatter(widget, container, true),
		parameter: categoryFormatter
	};
};

export {getComboFormatterBase as getComboFormatter};
