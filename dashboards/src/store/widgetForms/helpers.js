// @flow
import type {Breakdown, Indicator} from './types';
import type {DataSet as TableDataSet} from 'store/widgetForms/tableForm/types';
import {DEFAULT_AGGREGATION, DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';

/**
 * Возвращает разбивку по умолчанию
 * @param {string} dataKey - ключ сета данных
 * @returns {Breakdown}
 */
const getDefaultBreakdown = (dataKey: string): Breakdown => [{
	attribute: null,
	dataKey,
	group: {
		data: DEFAULT_SYSTEM_GROUP.OVERLAP,
		way: GROUP_WAYS.SYSTEM
	}
}];

/**
 * Заменяет агрегацию N/A на агрегацию CNT в индикаторах
 * @param {Array<Indicator>} indicators - массив индикаторов
 * @returns {Array<Indicator>}
 */
const fixIndecatorsAgregation = (indicators: Array<Indicator>): Array<Indicator> =>
	indicators.map(indicator => {
		return indicator.aggregation === DEFAULT_AGGREGATION.NOT_APPLICABLE
			? {...indicator, aggregation: DEFAULT_AGGREGATION.COUNT}
			: indicator;
	});

/**
 * Заменяет агрегацию N/A на агрегацию CNT в индикаторах источника данных
 * @param {TableDataSet}  dataSet - изначальный источник данных
 * @returns  {TableDataSet}
 */
const fixIndecatorsAgregationDataSet = (dataSet: TableDataSet): TableDataSet =>
	({
		...dataSet,
		indicators: fixIndecatorsAgregation(dataSet.indicators)
	});

export {
	getDefaultBreakdown,
	fixIndecatorsAgregation,
	fixIndecatorsAgregationDataSet
};
