// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_DT_INTERVAL_AXIS_FORMAT} from 'store/widgets/data/constants';
import {
	checkInfinity,
	checkZero,
	cntPercentFormatter,
	formatMSInterval,
	makeFormatterByFormat,
	percentFormat,
	sevenDaysFormatter
} from './helpers';
import type {
	ComboFormatter,
	ComboNumberFormatter,
	ComboValueFormatter,
	PercentStore,
	ValueFormatter
} from './types';
import type {ComboWidget} from 'store/widgets/data/types';
import {compose} from 'redux';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getDefaultFormatForParameter, getMainDataSet} from 'store/widgets/data/helpers';
import {hasCountPercent, hasMSInterval, hasPercent} from 'store/widgets/helpers';

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
	percentStore: PercentStore = {}
): ComboNumberFormatter => {
	const formatters = {};

	widget.data.forEach(dataSet => {
		const {breakdown, dataKey, indicators, parameters, showEmptyData, sourceForCompute} = dataSet;

		if (!sourceForCompute) {
			const {aggregation, attribute: indicatorAttribute, format: indicatorFormat} = indicators[0];
			const usesMSInterval = hasMSInterval(indicatorAttribute, aggregation);
			const usesPercent = hasPercent(indicatorAttribute, aggregation);
			const usesCountPercent = hasCountPercent(indicatorAttribute, aggregation);
			const {CUSTOM} = GROUP_WAYS;
			const hasCustomGroup = parameters[0].group.way === CUSTOM || breakdown?.[0].group.way === CUSTOM;
			const showZero = checkShowEmptyData && hasCustomGroup && showEmptyData;
			let formatter = null;

			if (usesMSInterval) {
				const {dataLabels} = widget;
				const dataLabelsFormat = indicatorFormat ?? dataLabels.format ?? dataLabels.computedFormat;

				if (dataLabelsFormat && dataLabelsFormat.type === AXIS_FORMAT_TYPE.DT_INTERVAL_FORMAT) {
					formatter = formatMSInterval(dataLabelsFormat);
				} else {
					formatter = formatMSInterval(DEFAULT_DT_INTERVAL_AXIS_FORMAT);
				}
			} else {
				formatter = oldValueFormatter(usesPercent, showZero);

				if (usesCountPercent) {
					formatter = cntPercentFormatter(formatter, percentStore);
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

	return makeFormatterByFormat(parameter.format ?? getDefaultFormatForParameter(attribute, group), false);
};

const getLegendFormatter = (widget: ComboWidget, crop: boolean): ComboValueFormatter => {
	const formatters = {};

	widget.data.forEach(dataSet => {
		const {breakdown, dataKey, parameters, sourceForCompute} = dataSet;

		if (!sourceForCompute) {
			const format = Array.isArray(breakdown)
				? widget.breakdownFormat ?? getDefaultFormatForParameter(breakdown[0].attribute, breakdown[0].group)
				: widget.parameter?.format ?? getDefaultFormatForParameter(parameters[0].attribute, parameters[0].group);
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
 * @param {PercentStore} percentStore - данные для cnt(%)
 * @returns {ComboFormatter} - объект с функциями форматерами и параметрами построения
 */
const getComboFormatterBase = (
	widget: ComboWidget,
	labels: Array<string> | Array<number>,
	percentStore: PercentStore = {}
): ComboFormatter => {
	const dataLabelFormatter = getDataFormatters(widget, true, percentStore);
	const categoryFormatter = getCategoryFormatter(widget);
	const indicatorFormatter = getDataFormatters(widget, false);

	return {
		dataLabel: dataLabelFormatter,
		indicator: indicatorFormatter,
		legend: getLegendFormatter(widget, true),
		parameter: categoryFormatter
	};
};

export {getComboFormatterBase as getComboFormatter};
