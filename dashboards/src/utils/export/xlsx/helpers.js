// @flow
import type {BaseColumn, PivotBaseColumn} from 'store/widgets/buildData/types';
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import type {PivotColumn} from 'utils/recharts/types';
import {PIVOT_COLUMN_TYPE} from 'utils/recharts/constants';
import t from 'localization';

/**
 * Преобразует строку в ArrayBuffer для скачивания
 * @param {string} s - строка
 * @returns {ArrayBuffer} - массив байт
 */
export const stringToArrayBuffer = (s: string): ArrayBuffer => {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);

	for (let i = 0; i < s.length; i++) {
		view[i] = s.charCodeAt(i) & 0xFF;
	}

	return buf;
};

/**
 * Преобразует столбец со сводной таблицы в столбец для экспорта
 * @param {PivotColumn} column - столбец из сводной таблицы
 * @returns {PivotBaseColumn} - столбец типа для экспорта
 */
export const pivotColumnToPivotBaseColumn = (column: PivotColumn): PivotBaseColumn => {
	const result: PivotBaseColumn = {
		accessor: column.key,
		footer: '',
		header: column.title,
		height: column.height,
		tooltip: null,
		type: COLUMN_TYPES.INDICATOR,
		width: column.width
	};

	if (column.type === PIVOT_COLUMN_TYPE.EMPTY_GROUP || column.type === PIVOT_COLUMN_TYPE.GROUP) {
		result.columns = column.children.map(pivotColumnToPivotBaseColumn);
	}

	if (column.type === PIVOT_COLUMN_TYPE.PARAMETER) {
		result.type = COLUMN_TYPES.PARAMETER;
	}

	if (column.type === PIVOT_COLUMN_TYPE.SUM) {
		result.header = t('PivotWidget::Sum');
		result.sumKeys = column.sumKeys;
	}

	return result;
};

/**
 * Создает преобразователь базового столбца для экспорта в расширенный столбец сводной таблицы для экспорта
 * @param {number} height - высота шапки
 * @returns {Function} - преобразователь столбцов
 */
export const baseColumnToPivotBaseColumn = (height: number) => (column: BaseColumn): PivotBaseColumn => ({
	...column,
	columns: column.columns?.map(baseColumnToPivotBaseColumn(height)) ?? [],
	height,
	width: column.width ?? 0
});
