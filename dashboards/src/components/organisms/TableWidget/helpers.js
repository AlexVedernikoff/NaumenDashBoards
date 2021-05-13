// @flow
import type {AttributeColumn} from 'store/widgets/buildData/types';
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';

/**
 * Сообщает о содержании в колонке значений карточек объекта
 * @param {AttributeColumn} column - колонка
 * @returns {boolean}
 */
const isCardObjectColumn = (column: AttributeColumn): boolean => {
	let aggregation;

	if (column.type === COLUMN_TYPES.INDICATOR) {
		({aggregation} = column);
	}

	if (column.type === COLUMN_TYPES.BREAKDOWN) {
		({aggregation} = column.indicator);
	}

	return isIndicatorColumn(column) && aggregation === DEFAULT_AGGREGATION.NOT_APPLICABLE;
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

export {
	isCardObjectColumn,
	isIndicatorColumn
};
