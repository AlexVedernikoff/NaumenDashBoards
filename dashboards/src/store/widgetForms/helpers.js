// @flow
import type {AttrSetConditions} from 'utils/descriptorUtils/types';
import type {Breakdown, DiagramDataSet, Indicator, SourceData} from './types';
import type {DataSet as TableDataSet} from 'store/widgetForms/tableForm/types';
import type {DataSet as SpeedometerDataSet} from 'store/widgetForms/speedometerForm/types';
import type {DataSet as SummaryDataSet} from 'store/widgetForms/summaryForm/types';
import {DEFAULT_AGGREGATION, DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {DEFAULT_PARAMETER} from 'store/widgetForms/constants';
import {omit} from 'helpers';
import {parseCasesAndGroupCode} from 'utils/descriptorUtils';
import type {PivotIndicator} from 'store/widgetForms/pivotForm/types';
import {SHOW_SUB_TOTAL_MODE} from './constants';

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
const parseAttrSetConditions = async (data: ?SourceData): Promise<?AttrSetConditions> => {
	let result = null;

	if (data && data.descriptor) {
		result = await parseCasesAndGroupCode(data.descriptor);
	}

	return result;
};

/**
 * Заменяет агрегацию N/A на агрегацию CNT в индикаторах
 * @param {Array<Indicator>} indicators - массив индикаторов
 * @returns {Array<Indicator>}
 */
const fixIndicatorsAggregation = (indicators: ?Array<Indicator>): Array<Indicator> =>
	indicators?.map(indicator => indicator?.aggregation === DEFAULT_AGGREGATION.NOT_APPLICABLE
		? {...indicator, aggregation: DEFAULT_AGGREGATION.COUNT}
		: indicator) ?? [];

const fixPivotIndicators = (
	indicators: null | Array<Indicator> | Array<PivotIndicator>
): Array<Indicator> =>
	indicators?.map(indicator => indicator) ?? [];

/**
 * Заменяет агрегацию N/A на агрегацию CNT в индикаторах источника данных
 * @param {TableDataSet} dataSet - изначальный источник данных
 * @returns {TableDataSet} - источник данных c исправленными показателями
 */
const fixIndicatorsAggregationDataSet = (dataSet: TableDataSet): TableDataSet =>
	({
		...dataSet,
		indicators: fixIndicatorsAggregation(dataSet.indicators)
	});

const fixIndicatorsTooltip = (needClearTooltip: boolean) =>
	(indicators: ?Array<Indicator>): Array<Indicator> => {
		let result = indicators || [];

		if (needClearTooltip) {
			result = result.map(indicator => ({
				...indicator,
				tooltip: {
					...(indicator.tooltip ?? {}),
					show: false
				}
			}));
		}

		return result;
	};

/**
 * Оставляет только один показатель в источнике
 * @param {TableDataSet | SpeedometerDataSet | SummaryDataSet} dataSet - изначальный источник данных
 * @returns {TableDataSet | SpeedometerDataSet | SummaryDataSet} - источник данных c ровно одним показателем
 */
function fixLeaveOneParameters <T: TableDataSet | SpeedometerDataSet | SummaryDataSet> (
	dataSet: T
): T {
	let result = dataSet;

	if (dataSet.parameters && dataSet.parameters.length > 1) {
		result = {
			...dataSet,
			parameters: dataSet.parameters.slice(0, 1)
		};
	} else if (!dataSet.parameters || dataSet.parameters.length === 0) {
		result = {
			...dataSet,
			parameters: [DEFAULT_PARAMETER]
		};
	}

	// $FlowFixMe: тип у T не меняется
	return result;
}

/**
 * Очищает параметры из таблицы для круговой диаграммы
 * @param {TableDataSet} dataSet - изначальный источник данных
 * @returns {TableDataSet} - источник данных c очищенными параметрами
 */
const fixRemoveParameters = (dataSet: TableDataSet): TableDataSet => omit(dataSet, 'parameters');

/**
 * Оставляет только один индикатор в источнике
 * @param {TableDataSet} dataSet - изначальный источник данных
 * @returns {TableDataSet} - источник данных c одним показателем
 */
const fixLeaveOneIndicator = (dataSet: TableDataSet): TableDataSet => {
	let result = dataSet;

	if (dataSet.indicators && dataSet.indicators.length > 1) {
		result = {
			...dataSet,
			indicators: dataSet.indicators.slice(0, 1)
		};
	}

	return result;
};

/**
 * Очищает форматы у индикаторов для данного типа виджета
 * @param {Array<Indicator> | null} indicators - список индикаторов
 * @returns {Array<Indicator>} - список индикаторов с очищенным форматом
 */
const fixClearIndicatorsFormat = (indicators: ?Array<Indicator>): Array<Indicator> =>
	(indicators || []).map(indicator => omit(indicator, 'format'));

/**
 * Определяет режим отображения/скрытия чекбокса промежуточных итогов
 * @param {?Array<DiagramDataSet>} data - источники данных на виджете
 * @returns {SHOW_SUB_TOTAL_MODE} - HIDE - скрыть; SHOW - показать; DISABLE - (временно) отобразить без возможности выбора
 * TODO: после реализации правильного расчета процента, функция должна возвращать boolean @see #SMRMEXT-13872
 */
const getShowSubTotalMode = (data: ?Array<DiagramDataSet>): $Keys<typeof SHOW_SUB_TOTAL_MODE> => {
	const aggregations = [];
	let result = SHOW_SUB_TOTAL_MODE.SHOW;

	if (data) {
		data.forEach(dataSet => {
			if (!dataSet.sourceForCompute) {
				dataSet.indicators.forEach(indicator => {
					if (indicator) aggregations.push(indicator.aggregation);
				});
			}
		});
	}

	if (aggregations.some(aggregation => aggregation === DEFAULT_AGGREGATION.PERCENT)) {
		result = SHOW_SUB_TOTAL_MODE.HIDE;
	} else if (aggregations.some(aggregation => aggregation === DEFAULT_AGGREGATION.PERCENT_CNT)) {
		// TODO: после удаления этого кода проверить, что не осталось временного кода с задачи #SMRMEXT-13872
		result = SHOW_SUB_TOTAL_MODE.DISABLE;
	}

	return result;
};

export {
	fixClearIndicatorsFormat,
	fixIndicatorsAggregation,
	fixIndicatorsAggregationDataSet,
	fixIndicatorsTooltip,
	fixLeaveOneIndicator,
	fixLeaveOneParameters,
	fixPivotIndicators,
	fixRemoveParameters,
	getDefaultBreakdown,
	getShowSubTotalMode,
	parseAttrSetConditions
};
