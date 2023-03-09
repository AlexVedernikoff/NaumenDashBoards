// @flow
import type {CustomGroupsMap} from 'store/customGroups/types';
import {hasCalcAndCustomGroups} from 'store/widgetForms/helpers';
import {SORTING_VALUES} from 'store/widgets/data/constants';
import type {Values} from 'store/widgetForms/axisChartForm/types';

/**
 * Изменяет настройки на сортировку по Параметру, если в Показателе присутствует поле для расчетов
 * и в Параметрах задана Пользовательская Группировка с несколькими группами
 * @see SMRMEXT-13847
 * @param {Values} values - виджет
 * @param {CustomGroupsMap} customGroups - пользовательские группировки
 * @returns {Values} обновленный виджет
 */
export const normalizeCalcAndCustomGroups = (
	values: Values,
	customGroups: CustomGroupsMap
): Values => {
	let result = values;

	if (hasCalcAndCustomGroups(values, customGroups)) {
		result = {...values, sorting: {...values.sorting, value: SORTING_VALUES.PARAMETER}};
	}

	return result;
};
