// @flow
import type {AttrSetConditions, Breakdown, Indicator, SourceData} from './types';
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
 * Извлекает фильтр для атрибутов из источника с дескриптором.
 * Используется при пользовательском режиме
 * @param {SourceData} data - источник с установленным дескриптором
 * @returns {AttrSetConditions} - информация для фильтрации атрибутов
 */
const parseAttrSetConditions = (data: ?SourceData): ?AttrSetConditions => {
	let result = null;

	if (data) {
		try {
			const {descriptor} = data;
			const descriptorObject = JSON.parse(descriptor);

			const {attrGroupCode: groupCode, cases} = descriptorObject;

			result = {cases, groupCode};
		} catch (e) {
			result = null;
		}
	}

	return result;
};

/**
 * Заменяет агрегацию N/A на агрегацию CNT в индикаторах
 * @param {Array<Indicator>} indicators - массив индикаторов
 * @returns {Array<Indicator>}
 */
const fixIndicatorsAgregation = (indicators: ?Array<Indicator>): Array<Indicator> =>
	indicators?.map(indicator => {
		return indicator.aggregation === DEFAULT_AGGREGATION.NOT_APPLICABLE
			? {...indicator, aggregation: DEFAULT_AGGREGATION.COUNT}
			: indicator;
	}) ?? [];

/**
 * Заменяет агрегацию N/A на агрегацию CNT в индикаторах источника данных
 * @param {TableDataSet}  dataSet - изначальный источник данных
 * @returns  {TableDataSet}
 */
const fixIndicatorsAgregationDataSet = (dataSet: TableDataSet): TableDataSet =>
	({
		...dataSet,
		indicators: fixIndicatorsAgregation(dataSet.indicators)
	});

export {
	getDefaultBreakdown,
	fixIndicatorsAgregation,
	fixIndicatorsAgregationDataSet,
	parseAttrSetConditions
};
