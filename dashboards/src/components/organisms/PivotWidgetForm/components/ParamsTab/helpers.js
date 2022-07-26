// @flow
import type {IndicatorGrouping, IndicatorInfo} from 'store/widgets/data/types';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import type {PivotValueUpdate} from './types';
import type {Values} from 'components/organisms/PivotWidgetForm/types';

/**
 * Фильтрует показатели по ключам, а также синхронизирует их имена
 * @param {IndicatorGrouping} indicatorGrouping - группировка показателей
 * @param {object} indicators - связка ключ показателя - имя показателя
 * @returns {IndicatorGrouping} - новая группировка показателей
 */
export const filterIndicatorGroupingByKeys = (
	indicatorGrouping: IndicatorGrouping,
	indicators: {[key: string]: string}
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
				result.push({...value, label: indicators[key]});
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
 * @returns  {PivotValueUpdate} - очищенные значения indicatorGrouping, links и parametersOrder
 */
export const getValuesDataUpdate = (values: Values): PivotValueUpdate => {
	const {data, indicatorGrouping, links, parametersOrder} = values;
	const dataKeys = data.map(dataSet => dataSet.dataKey);
	const dataKeysSet = new Set(dataKeys);
	const indicatorsKeys = {};

	data.forEach(dataSet =>
		dataSet.indicators.forEach(indicator => {
			indicatorsKeys[indicator.key] = indicator.attribute?.title ?? '';
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
			indicators.forEach(({attribute, breakdown, key}) => {
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
