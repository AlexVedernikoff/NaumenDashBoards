// @flow
import type {AttributeColumn} from './types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {COLUMN_TYPES} from './constants';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';

/**
 * Сообщает о содержании в колонке значений карточек объекта
 * @param {AttributeColumn} column - колонка
 * @returns {boolean}
 */
const isCardObjectColumn = (column: AttributeColumn): boolean => {
	let {attribute} = column;
	let aggregation;

	if (column.type === COLUMN_TYPES.INDICATOR) {
		({aggregation} = column);
	}

	if (column.type === COLUMN_TYPES.BREAKDOWN) {
		({aggregation, attribute} = column.indicator);
	}

	return isIndicatorColumn(column) && aggregation === DEFAULT_AGGREGATION.NOT_APPLICABLE
		&& (attribute.type in ATTRIBUTE_SETS.REFERENCE || attribute.type === ATTRIBUTE_TYPES.string);
};

/**
 * Сообщает о содержании в колонке значений показателя
 * @param {AttributeColumn} column - колонка
 * @returns {boolean}
 */
const isIndicatorColumn = (column: AttributeColumn): boolean => {
	const {type} = column;
	const {BREAKDOWN, INDICATOR} = COLUMN_TYPES;

	return type === BREAKDOWN || type === INDICATOR;
};

/**
 * Возвращает значение представления без переданного кода
 * @param {string} value - значение представления
 * @param {string} separator - разделитель лейбла и кода
 * @returns {string}
 */
const getSeparatedLabel = (value: string, separator: string): string => value.split(separator)[0];

export {
	isCardObjectColumn,
	isIndicatorColumn,
	getSeparatedLabel
};
