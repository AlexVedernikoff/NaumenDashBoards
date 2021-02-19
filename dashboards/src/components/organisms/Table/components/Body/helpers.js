// @flow
import type {Row} from 'Table/types';

/**
 * Производит сортировку строк
 * @param {Array<Row>} data - массив строк
 * @param {string} accessor - код колонки по которой необходимо провести сортировку
 * @param {boolean} asc - сообщает о направлении сортировки
 * @returns {Array<Row>}
 */
const sort = (data: Array<Row>, accessor: string, asc: boolean): Array<Row> => data.sort((row1, row2) => {
	const leftValue = String(asc ? row1[accessor] : row2[accessor]);
	const rightValue = String(asc ? row2[accessor] : row1[accessor]);

	return leftValue.localeCompare(rightValue, undefined, {
		numeric: true,
		sensitivity: 'base'
	});
});

export {
	sort
};
