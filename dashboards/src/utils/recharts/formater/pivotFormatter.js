// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {checkNumber, getLabelFormatter, makeFormatterByNumberFormat} from './helpers';
import {DEFAULT_AGGREGATION, INTEGER_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_NUMBER_AXIS_FORMAT, DEFAULT_TABLE_VALUE} from 'store/widgets/data/constants';
import type {DefaultTableValue, MixedAttribute, PivotWidget} from 'store/widgets/data/types';
import {hasPercent} from 'store/widgets/helpers';
import type {PivotFormatter, PivotValueFormatter, ValueFormatter, ValuePivotFormatter} from './types';
import type {PivotSeriesData} from 'utils/recharts/types';

/**
 * Формирование строки по умолчанию
 * @param {DefaultTableValue} value - значение строки по умолчанию
 * @returns {string} - строка по умолчанию
 */
const getDefaultValue = (value: DefaultTableValue): string => {
	const {DASH, NULL, ZERO} = DEFAULT_TABLE_VALUE;

	switch (value) {
		case DASH:
			return '-';
		case NULL:
			return 'null';
		case ZERO:
			return '0';
		default:
			return '\u00A0';
	}
};

const pivotNullFormatter = (defaultValue: string, formatter: ValueFormatter): PivotValueFormatter =>
	(value: string | [number, number] | number | null) => {
		let result = '';

		if (value === null) {
			result = defaultValue;
		} else if (Array.isArray(value)) {
			result = formatter(value[0]);
		} else {
			result = formatter(value);
		}

		return result;
	};

const getPivotFormatterForAttribute = (attribute: MixedAttribute | null, aggregation: string): ValueFormatter => {
	const usesPercent = hasPercent(attribute, aggregation);
	let numberFormat = DEFAULT_NUMBER_AXIS_FORMAT;

	if (usesPercent) {
		numberFormat = {...DEFAULT_NUMBER_AXIS_FORMAT, additional: '%', symbolCount: 2};
	} else {
		const isAVG = aggregation === INTEGER_AGGREGATION.AVG;
		const floatTypes = [ATTRIBUTE_TYPES.COMPUTED_ATTR, ATTRIBUTE_TYPES.double];
		const isFloatType = floatTypes.includes(attribute?.type);
		const defaultSymbolCount = isAVG || isFloatType ? 2 : 0;

		numberFormat = {...DEFAULT_NUMBER_AXIS_FORMAT, symbolCount: defaultSymbolCount};
	}

	return checkNumber(makeFormatterByNumberFormat(numberFormat, false));
};

const checkCntPercentFormatter = (
	defaultString: string,
	defaultFormatter: PivotValueFormatter
): PivotValueFormatter => {
	const percentNumberFormat = {...DEFAULT_NUMBER_AXIS_FORMAT, additional: '%', symbolCount: 2};
	const percentFormatter = pivotNullFormatter(defaultString,
		checkNumber(makeFormatterByNumberFormat(percentNumberFormat, false))
	);

	return value => {
		if (Array.isArray(value)) {
			const cntSting = defaultFormatter(value[0]);
			const percentString = percentFormatter(value[1]);
			return `${cntSting} (${percentString})`;
		}

		return defaultFormatter(value);
	};
};

/**
 * Форматер для столбцов сводной таблицы
 * @param {PivotWidget} widget - виджет сводной таблицы
 * @returns {ValuePivotFormatter} - форматер значений сводной по столбцам
 */
const getValueFormatter = (widget: PivotWidget): ValuePivotFormatter => {
	const defaultString = getDefaultValue(widget.pivot?.body?.defaultValue?.value ?? DEFAULT_TABLE_VALUE.EMPTY_ROW);
	let defaultFormatter = pivotNullFormatter(defaultString, getPivotFormatterForAttribute(null, DEFAULT_AGGREGATION.COUNT));

	defaultFormatter = checkCntPercentFormatter(defaultString, defaultFormatter);

	const formatters = {};

	widget.data.forEach(dataSet => {
		dataSet.indicators && dataSet.indicators.forEach(indicator => {
			const {aggregation, attribute, breakdown, key} = indicator;
			let formatter = breakdown
				? getPivotFormatterForAttribute(breakdown.attribute, DEFAULT_AGGREGATION.COUNT)
				: getPivotFormatterForAttribute(attribute, aggregation);

			formatter = pivotNullFormatter(defaultString, formatter);
			formatter = checkCntPercentFormatter(defaultString, formatter);

			formatters[key] = formatter;
		});
	});

	return (key: string, value: string | [number, number] | number | null) =>
		(key in formatters) ? formatters[key](value) : defaultFormatter(value);
};

/**
 * Форматер для итогов
 * @param {PivotWidget} widget - виджет сводной таблицы
 * @returns {ValuePivotFormatter} - форматер значений сводной с одним столбцом
 */
const getTotalFormatter = (widget: PivotWidget): ValuePivotFormatter => {
	const defaultString = getDefaultValue(widget.pivot?.body?.defaultValue?.value ?? DEFAULT_TABLE_VALUE.EMPTY_ROW);
	const numberFormat = {...DEFAULT_NUMBER_AXIS_FORMAT, symbolCount: null};
	const totalFormatter = checkNumber(makeFormatterByNumberFormat(numberFormat, false));
	const formatter = pivotNullFormatter(defaultString, totalFormatter);

	return (key: string, value: string | [number, number] | number | null) => formatter(value);
};

const getPivotFormatter = (widget: PivotWidget, data: PivotSeriesData): PivotFormatter => {
	const titleFormatter = getLabelFormatter();

	return {
		indicator: titleFormatter,
		parameter: titleFormatter,
		total: getTotalFormatter(widget),
		value: getValueFormatter(widget)
	};
};

export {getPivotFormatter};
