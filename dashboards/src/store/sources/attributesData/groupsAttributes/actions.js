// @flow
import api from 'api';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getGroupAttrKey} from './helpers';
import {getGroupsAttributes} from './selectors';

/**
 * Получает список атрибутов в данной группе
 * @param {string} classFqn - источник
 * @param {string} attrGroupCode - группа
 * @returns {ThunkAction}
 */
const fetchGroupsAttributes = (classFqn: string, attrGroupCode: string | null): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<Array<string>> => {
		const state = getState();

		let groupsAttributes = getGroupsAttributes(state, classFqn, attrGroupCode)?.items;

		if (!groupsAttributes) {
			const key = getGroupAttrKey(classFqn, attrGroupCode);

			dispatch({
				payload: key,
				type: 'REQUEST_GROUPS_ATTRIBUTES_ACTION'
			});

			try {
				groupsAttributes = await api.instance.dashboards.getNonMetadataAttributeCodes(classFqn, attrGroupCode);

				dispatch({
					payload: {
						data: groupsAttributes,
						key
					},
					type: 'RECEIVE_GROUPS_ATTRIBUTES_ACTION'
				});

				return groupsAttributes;
			} catch (error) {
				groupsAttributes = [];
				dispatch({
					payload: key,
					type: 'REQUEST_GROUPS_ATTRIBUTES_ACTION_ERROR'
				});
			}
		}

		return groupsAttributes ?? [];
	};

export {
	fetchGroupsAttributes
};
