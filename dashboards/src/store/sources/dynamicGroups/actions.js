// @flow
import api from 'api';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {findFilterById} from 'store/sources/sourcesFilters/selectors';

/**
 * Получение группы динамических атрибутов
 * @param {string} dataKey - ключ набора данных
 * @param {string} descriptor - дескриптор источника
 * @param {string} filterId - (optional) сохраненный фильтр источника
 * @returns {ThunkAction}
 */
const fetchDynamicAttributeGroups = (dataKey: string, descriptor: string, filterId: ?string): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		let actualDescriptor = descriptor;

		if (filterId) {
			const state = getState();
			const filter = findFilterById(state)(filterId);

			if (filter) {
				actualDescriptor = filter.descriptor;
			}
		}

		dispatch({
			payload: dataKey,
			type: 'sources/dynamicAttributes/requestDynamicAttributeGroups'
		});

		try {
			const groups = await api.instance.dashboards.getDynamicAttributeGroups(actualDescriptor);

			dispatch({
				payload: {
					dataKey,
					groups
				},
				type: 'sources/dynamicAttributes/receiveDynamicAttributeGroups'
			});
		} catch (error) {
			dispatch({
				payload: dataKey,
				type: 'sources/dynamicAttributes/recordDynamicAttributeGroupsError'
			});
		}
	};

/**
 * Получает динамические атрибуты конкретной группы
 * @param {string} dataKey - ключ набора данных
 * @param {string} groupCode - код группы динамических атрибутов
 * @returns {ThunkAction}
 */
const fetchDynamicAttributes = (dataKey: string, groupCode: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		payload: groupCode,
		type: 'sources/dynamicAttributes/requestDynamicAttributes'
	});

	try {
		const attributes = await api.instance.dashboards.getDynamicAttributes(groupCode);

		dispatch({
			payload: {
				attributes,
				dataKey,
				groupCode
			},
			type: 'sources/dynamicAttributes/receiveDynamicAttributes'
		});
	} catch (error) {
		dispatch({
			payload: groupCode,
			type: 'sources/dynamicAttributes/recordDynamicAttributesError'
		});
	}
};

/**
 * Поиск по динамическим атрибутам
 * @param {string} dataKey - ключ набора данных
 * @param {string} searchValue - строка для поиска
 * @param {string} descriptor - дескриптор источника
 * @param {string} filterId - (optional) сохраненный фильтр источника
 * @returns {ThunkAction}
 */
const fetchSearchDynamicAttributeGroups = (dataKey: string, searchValue: string, descriptor: string, filterId: ?string): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		let actualDescriptor = descriptor;

		if (filterId) {
			const state = getState();
			const filter = findFilterById(state)(filterId);

			if (filter) {
				actualDescriptor = filter.descriptor;
			}
		}

		dispatch({
			payload: dataKey,
			type: 'sources/dynamicAttributes/requestDynamicAttributeGroups'
		});

		try {
			const groups = await api.instance.dashboards.searchDynamicAttributes(actualDescriptor, searchValue);

			dispatch({
				payload: {
					dataKey,
					groups
				},
				type: 'sources/dynamicAttributes/receiveDynamicAttributesSearch'
			});
		} catch (error) {
			dispatch({
				payload: dataKey,
				type: 'sources/dynamicAttributes/recordDynamicAttributeGroupsError'
			});
		}
	};

/**
 * Очищает динамические атрибуты конкретной группы
 * @param {string} dataKey - ключ набора данных
 * @returns {ThunkAction}
 */
const clearDynamicAttributeGroups = (dataKey: string) => ({
	payload: dataKey,
	type: 'sources/dynamicAttributes/clearDynamicAttributeGroups'
});

export {
	clearDynamicAttributeGroups,
	fetchDynamicAttributeGroups,
	fetchDynamicAttributes,
	fetchSearchDynamicAttributeGroups
};
