// @flow
import type {AxisFormat, CircleWidget} from 'store/widgets/data/types';
import {AXIS_FORMAT_TYPE} from 'store/widgets/data/constants';
import {
	checkInfinity,
	checkNumber,
	checkString,
	cntPercentFormatter,
	defaultNumberFormatter,
	formatMSInterval,
	getDataLabelsFormat,
	getLabelFormatter,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	sevenDaysFormatter,
	storedFormatter
} from './helpers';
import type {CircleFormatter, NumberFormatter, PercentStore, ValueFormatter} from './types';
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {getDefaultFormatForParameter, getMainDataSet} from 'store/widgets/data/helpers';
import {hasCountPercent, hasPercent} from 'store/widgets/helpers';

const getDataFormatter = (
	widget: CircleWidget,
	format: AxisFormat,
	percentStore: PercentStore
): NumberFormatter => {
	const dataSet = getMainDataSet(widget.data);
	const {indicators} = dataSet;
	const {aggregation, attribute: indicatorAttribute} = indicators[0];
	const usesPercent = hasPercent(indicatorAttribute, aggregation);
	const usesCntPercent = hasCountPercent(indicatorAttribute, aggregation);

	let formatter = checkNumber(defaultNumberFormatter(0));

	if (format.type === AXIS_FORMAT_TYPE.DT_INTERVAL_FORMAT) {
		formatter = checkNumber(formatMSInterval(format));
	} else if (format.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT || format.type === AXIS_FORMAT_TYPE.INTEGER_FORMAT) {
		const numberFormat = !format.additional && usesPercent ? {...format, additional: '%'} : format;

		formatter = makeFormatterByNumberFormat(numberFormat);

		if (usesCntPercent) {
			formatter = cntPercentFormatter(formatter, percentStore);
		} else {
			formatter = checkInfinity(formatter);
		}
	} else if (format.type === AXIS_FORMAT_TYPE.LABEL_FORMAT) {
		formatter = checkString(getLabelFormatter(format.labelFormat));
	}

	return formatter;
};

/**
 * Создает форматер для подписей в tooltip
 * @param {CircleWidget} widget - виджет
 * @returns {ValueFormatter} - функция-форматер
 */
const getCategoryFormatter = (widget: CircleWidget): ValueFormatter => {
	const {breakdownFormat} = widget;
	const dataSet = getMainDataSet(widget.data);
	const {attribute, group} = dataSet.breakdown[0];

	if (group.way === GROUP_WAYS.SYSTEM && group.data === DATETIME_SYSTEM_GROUP.SEVEN_DAYS) {
		return sevenDaysFormatter;
	}

	return makeFormatterByFormat(breakdownFormat ?? getDefaultFormatForParameter(attribute, group), false);
};

/**
 * Фабрика форматеров для круговой диаграммы
 * @param {CircleWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {PercentStore} percentStore - данные для cnt(%)
 * @returns {CircleFormatter} - объект с функциями форматерами и параметрами построения
 */
const getCircleFormatterBase = (
	widget: CircleWidget,
	labels: Array<string> | Array<number>,
	percentStore: PercentStore = {}
): CircleFormatter => {
	const dataLabelsFormat = getDataLabelsFormat(widget);
	const categoryFormatter = getCategoryFormatter(widget);
	const dataLabelsFormatter = getDataFormatter(widget, dataLabelsFormat, percentStore);

	return {
		category: categoryFormatter,
		label: dataLabelsFormatter
	};
};

/**
 * Оболочка для getCircleFormatterBase, предназначенная для сохранения отформатированных значений в блок и вывода его в консоль.
 * Нужна для формирования тест-кейсов по виджетам
 * @param {CircleWidget} widget - виджет
 * @param {Array<string> | Array<number>} labels - метки данных для расчета переносов
 * @param {PercentStore} percentStore - данные для cnt(%)
 * @returns {CircleFormatter} - объект с функциями форматерами и параметрами построения
 */
// eslint-disable-next-line no-unused-vars
const getCircleFormatterDebug = (
	widget: CircleWidget,
	labels: Array<string> | Array<number>,
	percentStore: PercentStore = {}
): CircleFormatter => {
	const store = {labels, widget};
	const baseFormatter = getCircleFormatterBase(widget, labels, percentStore);
	const category = [];
	const label = [];

	console.info('getCircleFormatterBase: ', {...store, category, label});

	return {
		category: storedFormatter(category, baseFormatter.category),
		label: storedFormatter(label, baseFormatter.label)
	};
};

export {getCircleFormatterBase as getCircleFormatter};
