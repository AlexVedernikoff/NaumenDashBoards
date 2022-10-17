// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';

/**
 * Проверяет на запрет формирования столбца Итого
 * @param {Array<DataSet>} data - источники
 * @returns {boolean}
 */
export const hasDisableTotal = (data: Array<DataSet>): boolean => {
	const aggregations = data.flatMap(dataSet => dataSet.indicators?.map(indicator => indicator.aggregation) ?? []);
	return aggregations.length === 0 || !aggregations.every(aggregation => aggregation === aggregations[0]);
};
