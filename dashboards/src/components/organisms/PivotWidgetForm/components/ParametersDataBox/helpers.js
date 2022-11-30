// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';

/**
 * Проверяет на запрет формирования столбца "Итого"
 * @param {Array<DataSet>} data - источники
 * @returns {boolean} - признак на запрет формирования столбца "Итого"
 */
export const hasDisableTotal = (data: Array<DataSet> = []): boolean => {
	const indicators = data.flatMap(({indicators = []}) => indicators);
	const aggregations = indicators.map(({aggregation}) => aggregation);
	const disableByAggregations = aggregations.length === 0 || new Set(aggregations).size !== 1;
	const disableByIndicators = indicators.length === 0 || (indicators.length === 1 && !indicators[0].breakdown);

	return disableByIndicators || disableByAggregations;
};
