// @flow
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import {DYNAMIC_GROUPS_EVENTS} from './constants';

/**
 * Получаем группы динамических атрибутов
 * @param {string} dataKey - ключ набора данных
 * @param {string} descriptor - фильтр
 * @returns {ThunkAction}
 */
const fetchDynamicAttributeGroups = (dataKey: string, descriptor: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		payload: dataKey,
		type: DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTE_GROUPS
	});

	try {
		const url = buildUrl('dashboards', 'getDynamicAttributeGroups', 'requestContent');
		const {data: groups} = await client.post(url, {descriptor});

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
		const url = buildUrl('dashboards', 'getDynamicAttributes', 'requestContent');
		const data = {
			uuid: groupCode
		};
		const {data: attributes} = await client.post(url, data);

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
