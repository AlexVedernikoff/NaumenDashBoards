// @flow
import deepEqual from 'fast-deep-equal';
import type {IndicatorGrouping, IndicatorInfo, PivotLink} from 'store/widgets/data/types';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import type {IndicatorsUpdate, PivotValueUpdate} from './types';
import type {Parameter, ParameterOrder} from 'store/widgetForms/types';
import type {Values} from 'components/organisms/PivotWidgetForm/types';

/**
 * Фильтрует показатели по ключам, а также синхронизирует их имена и разбивку
 * @param {IndicatorGrouping} indicatorGrouping - группировка показателей
 * @param {object} indicators - объект связки, где key - ключ показателя, а value - наличие разбивки и имя показателя
 * @returns {IndicatorGrouping} - новая группировка показателей
 */
export const filterIndicatorGroupingByKeys = (
	indicatorGrouping: IndicatorGrouping,
	indicators: IndicatorsUpdate
): IndicatorGrouping => {
	const result = [];

	indicatorGrouping.forEach(value => {
		if (value.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO) {
			if (value.children) {
				value.children = filterIndicatorGroupingByKeys(value.children, indicators);
			}

			result.push(value);
		} else if (value.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO) {
			const {key} = value;

			if (key in indicators) {
				const {hasBreakdown, label} = indicators[key];

				result.push({...value, hasBreakdown, label});
			}
		}
	});

	return result;
};

/**
 * Возвращает ключи всех индикаторов
 * @param {IndicatorGrouping} indicatorGrouping - группировка показателей
 * @returns {Array<string>}  - ключи
 */
export const getAllKeysInIndicatorGrouping = (indicatorGrouping: IndicatorGrouping): Array<string> => {
	const result = [];

	indicatorGrouping.forEach(value => {
		if (value.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO && value.children) {
			const innerKeys = getAllKeysInIndicatorGrouping(value.children);

			innerKeys.forEach(key => result.push(key));
		} else if (value.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO) {
			result.push(value.key);
		}
	});

	return result;
};

/**
 * Синхронизирует значения indicatorGrouping, links и parametersOrder по параметрам и показателям,
 * которые есть в data.
 * @param {Values} values - значение формы
 * @returns {PivotValueUpdate} - очищенные значения indicatorGrouping, links и parametersOrder
 */
export const getValuesDataUpdate = (values: Values): PivotValueUpdate => {
	const {data, indicatorGrouping, links, parametersOrder} = values;
	const dataKeys = data.map(dataSet => dataSet.dataKey);
	const dataKeysSet = new Set(dataKeys);
	const indicatorsKeys: IndicatorsUpdate = {};

	data.forEach(dataSet =>
		dataSet.indicators.filter(Boolean).forEach(indicator => {
			indicatorsKeys[indicator.key] = {
				hasBreakdown: !!indicator.breakdown,
				label: indicator.attribute?.title ?? ''
			};
		})
	);

	const newIndicatorGrouping = indicatorGrouping
		? filterIndicatorGroupingByKeys(indicatorGrouping, indicatorsKeys)
		: null;
	const newLinks = links.filter(link => dataKeysSet.has(link.dataKey1) && dataKeysSet.has(link.dataKey2));
	const newParametersOrder = parametersOrder.filter(parametersOrder => dataKeysSet.has(parametersOrder.dataKey));

	return {indicatorGrouping: newIndicatorGrouping, links: newLinks, parametersOrder: newParametersOrder};
};

/**
 * Возвращает показатели, которых нет в indicatorGrouping
 * @param {Values} values - значение формы
 * @returns {Array<IndicatorInfo>} - показатели
 */
export const getUnusedIndicators = (values: Values): Array<IndicatorInfo> => {
	const result = [];
	const {data, indicatorGrouping} = values;

	if (indicatorGrouping !== null) {
		const groupingKeysSet = new Set(getAllKeysInIndicatorGrouping(indicatorGrouping));

		data.forEach(({indicators}) =>
			indicators.filter(Boolean).forEach(({attribute, breakdown, key}) => {
				if (!groupingKeysSet.has(key)) {
					result.push({
						hasBreakdown: !!breakdown?.attribute,
						key,
						label: attribute?.title ?? '',
						type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
					});
				}
			})
		);
	}

	return result;
};

/**
 * Возвращает список связей, которые не связаны с указанным источником
 * @param {Array<PivotLink>} links - массив связей
 * @param {string} dataKey - идентификатор источника
 * @returns {Array<PivotLink>} новый массив связей
 */
export const removeLinksForSource = (links: Array<PivotLink>, dataKey: string): Array<PivotLink> =>
	links.filter(link => (link.dataKey1 !== dataKey && link.dataKey2 !== dataKey));

/**
 * Возвращает список, заменяя параметры с кодом источника dataKey так что,
 * параметру из oldParameters соответствует параметр с тем же индексом в newParameters
 * @param {Array<ParameterOrder>} parametersOrder - отсортированный список параметров
 * @param {string} dataKey  - код источника
 * @param {Array<Parameter>} oldParameters - старые параметры
 * @param {Array<Parameter>} newParameters - новые параметры
 * @returns {Array<ParameterOrder>} - новый список ParameterOrder
 */
export const fixParametersOrder = (
	parametersOrder: Array<ParameterOrder>,
	dataKey: string,
	oldParameters: Array<Parameter>,
	newParameters: Array<Parameter>
): Array<ParameterOrder> => parametersOrder.map(param => {
	let result = param;

	if (param.dataKey === dataKey) {
		const index = oldParameters.findIndex(parameter => deepEqual(parameter, param.parameter));

		if (index >= 0) {
			result = {dataKey, parameter: newParameters[index]};
		}
	}

	return result;
});
