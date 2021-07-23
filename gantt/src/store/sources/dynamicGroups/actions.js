// @flow
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {DYNAMIC_GROUPS_EVENTS} from './constants';
import {findFilterById} from 'store/sources/sourcesFilters/selectors';

/**
 * Получение группы динамических атрибутов
 *
 * @param {string} dataKey - ключ набора данных
 * @param {string} descriptor - дескриптор источника
 * @param {string} filterId - (optional) сохраненный фильтр источника
 * @returns {ThunkAction}
 */
const fetchDynamicAttributeGroups = (dataKey: string, descriptor: string, filterId?: string): ThunkAction =>
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
			type: DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTE_GROUPS
		});

		try {
			const groups = await window.jsApi.restCallModule('dashboards', 'getDynamicAttributeGroups', actualDescriptor);

			dispatch({
				payload: {
					dataKey,
					groups
				},
				type: DYNAMIC_GROUPS_EVENTS.RECEIVE_DYNAMIC_ATTRIBUTE_GROUPS
			});
		} catch (error) {
			dispatch({
				payload: dataKey,
				type: DYNAMIC_GROUPS_EVENTS.RECORD_DYNAMIC_ATTRIBUTE_GROUPS_ERROR
			});
		}
	};

/**
 * Получаем динамические атрибуты конкретной группы
 * @param {string} dataKey - ключ набора данных
 * @param {string} groupCode - код группы динамических атрибутов
 * @returns {ThunkAction}
 */
const fetchDynamicAttributes = (dataKey: string, groupCode: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		payload: groupCode,
		type: DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTES
	});

	try {
		const attributes = await window.jsApi.restCallModule('dashboards', 'getDynamicAttributes', groupCode);

		dispatch({
			payload: {
				attributes,
				dataKey,
				groupCode
			},
			type: DYNAMIC_GROUPS_EVENTS.RECEIVE_DYNAMIC_ATTRIBUTES
		});
	} catch (error) {
		dispatch({
			payload: groupCode,
			type: DYNAMIC_GROUPS_EVENTS.RECORD_DYNAMIC_ATTRIBUTES_ERROR
		});
	}
};

export {
	fetchDynamicAttributeGroups,
	fetchDynamicAttributes
};
