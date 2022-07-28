// @flow
import type {DataSet, NotPivotValues, NotPivotValuesDataSets, ParseDataForPivotResult, PivotIndicator, State} from './types';
import {deepClone} from 'helpers';
import {DEFAULT_INDICATOR, DEFAULT_SOURCE} from 'store/widgetForms/constants';
import {DEFAULT_PRESET_COLOR} from './constants';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import type {PivotStyle, Table} from 'store/widgets/data/types';
import uuid from 'tiny-uuid';
import type {Values as TableValues} from 'src/store/widgetForms/tableForm/types';

/**
 * Создает базовый объект данных сводной таблицы
 * @param {string} dataKey - ключ объекта данных
 * @returns {DataSet}
 */
const createPivotDataSet = (dataKey: string): DataSet => ({
	dataKey,
	indicators: [],
	parameters: [],
	source: DEFAULT_SOURCE,
	sourceForCompute: false,
	type: 'PivotDataSet'
});

/**
 * Создает индикатор для сводной таблицы
 * @param {string} key - ключ индикатора
 * @returns {PivotIndicator}
 */
const createPivotIndicator = (key?: string): PivotIndicator => ({
	...DEFAULT_INDICATOR,
	key: key ?? uuid()
});

/**
 * Переводит источники с остальных форм в формат сводной таблицы, а также вычисляет
 * сортировку показателей по умолчанию и группировку индикаторов
 * @param {Array<DataSet>}  data     [data description]
 * @returns {ParseDataForPivotResult}
 */
const parseDataForPivot = (data: NotPivotValuesDataSets): ParseDataForPivotResult => {
	const newData = [];
	const parametersOrder = [];
	const indicatorGrouping = [];

	data.forEach(dataSet => {
		const {dataKey, indicators: oldIndicators, parameters = [], source} = dataSet;
		const newDataSet = createPivotDataSet(dataKey);
		const indicators = oldIndicators.map(indicator => ({...indicator, key: uuid()}));

		newData.push({...newDataSet, dataKey, indicators, parameters, source});

		parameters.forEach(parameter => parametersOrder.push({dataKey, parameter}));

		indicators.forEach(indicator => indicatorGrouping.push({
			hasBreakdown: false,
			key: indicator.key ?? '',
			label: indicator.attribute?.title ?? '',
			type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
		}));
	});

	return {data: newData, indicatorGrouping, parametersOrder};
};

/**
 * Изменяет значения формы сводной таблицы относительно изменений остальных форм, кроме таблицы
 * @param {State} state - состояние формы сводной таблицы
 * @param {NotPivotValues} values - значения остальных форм
 * @returns {State}
 */
const changeValues = (
	state: State,
	values: NotPivotValues
): State => {
	const {
		computedAttrs,
		data: oldData,
		displayMode,
		header,
		name,
		navigation,
		templateName,
		tooltip
	} = values;

	const {links, pivot} = state;
	const {data, indicatorGrouping, parametersOrder} = parseDataForPivot(oldData);

	return {
		computedAttrs,
		data,
		displayMode,
		header,
		indicatorGrouping: indicatorGrouping,
		links,
		name,
		navigation,
		parametersOrder: parametersOrder,
		pivot,
		templateName,
		tooltip
	};
};

/**
 * Переводит табличные стили на стили для сводной
 * @param {Table} table - табличные стили
 * @returns {PivotStyle} - стили для сводной таблицы
 */
const convertTableStyleToPivot = (table: Table): PivotStyle => {
	const {body, columnHeader} = deepClone(table);
	const newBody = {...body, parameterRowColor: DEFAULT_PRESET_COLOR};

	return {body: newBody, columnHeader};
};

/**
 * Изменяет значения формы сводной таблицы относительно изменений таблицы
 * @param {State} state - состояние формы сводной таблицы
 * @param {TableValues} values - значения остальных форм
 * @returns {State}
 */
const changeValuesByTable = (
	state: State,
	values: TableValues
): State => {
	const {
		computedAttrs,
		data: oldData,
		displayMode,
		header,
		name,
		navigation,
		table,
		templateName,
		tooltip
	} = values;
	const {links} = state;
	const {data, indicatorGrouping, parametersOrder} = parseDataForPivot(oldData);
	const pivot = convertTableStyleToPivot(table);

	return {
		computedAttrs,
		data,
		displayMode,
		header,
		indicatorGrouping,
		links,
		name,
		navigation,
		parametersOrder,
		pivot,
		templateName,
		tooltip
	};
};

export {
	changeValues,
	changeValuesByTable,
	createPivotDataSet,
	createPivotIndicator
};
