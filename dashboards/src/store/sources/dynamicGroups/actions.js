// @flow
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {DynamicGroup} from './types';
import {DYNAMIC_GROUPS_EVENTS} from './constants';

/**
 * Получаем динамические атрибуты конкретной группы
 * @param {string} classFqn - код класса
 * @param {string} groupCode - код группы динамических атрибутов
 * @returns {ThunkAction}
 */
const fetchGroupDynamicAttributes = (classFqn: string, groupCode: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		payload: groupCode,
		type: DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTES
	});

	try {
		const url = buildUrl('dashboards', 'getGroupDynamicAttributes', 'requestContent');
		const data = {
			classFqn,
			uuid: groupCode
		};
		const {data: attributes} = await client.post(url, data);

		dispatch({
			payload: {
				attributes,
				code: groupCode
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

const setDynamicGroups = (payload: Array<DynamicGroup>) => ({
	payload,
	type: DYNAMIC_GROUPS_EVENTS.SET_DYNAMIC_GROUPS
});

export {
	fetchGroupDynamicAttributes,
	setDynamicGroups
};
