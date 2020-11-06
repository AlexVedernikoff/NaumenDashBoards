// @flow
import type {Column, ColumnsWidth} from './types';

/**
 * Возвращает итоговую ширину колонок с учетом подстолбцов
 * @param {ColumnsWidth} columnsWidth - данные ширины столбцов
 * @param {Array<Column>} columns - колонки
 * @returns {number}
 */
const sumColumnsWidth = (columnsWidth: ColumnsWidth, columns: Array<Column>): number => columns
	.map(column => Array.isArray(column.columns) ? sumColumnsWidth(columnsWidth, column.columns) : columnsWidth[column.accessor])
	.reduce((sum, width) => sum + width);

export {
	sumColumnsWidth
};
