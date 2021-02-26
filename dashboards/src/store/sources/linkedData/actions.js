// @flow
import {arrayToTree} from 'utils/arrayToTree';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getDataSourceValue} from 'store/sources/data/actions';
import {LINKED_DATA_SOURCES_EVENTS} from './constants';

/**
 * Возвращает ссылочные источники
 * @param {string} classFqn - код источника
 * @returns {ThunkAction}
 */
const fetchLinkedDataSources = (classFqn: string): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	const {[classFqn]: source} = getState().sources.data.map;

	dispatch({
		payload: {
			...source,
			children: [],
			parent: null
		},
		type: LINKED_DATA_SOURCES_EVENTS.REQUEST_LINKED_DATA_SOURCES
	});

	try {
		const {backBOLinks, boLinks, object} = ATTRIBUTE_TYPES;
		const payload = {
			classFqn,
			types: [backBOLinks, boLinks, object]
		};
		const sources = await window.jsApi.restCallModule('dashboards', 'getLinkedDataSources', payload);

		dispatch({
			payload: {
				id: classFqn,
				sources: arrayToTree(sources, {
					keys: {
						id: 'classFqn'
					},
					parent: classFqn,
					values: {
						value: getDataSourceValue
					}
				})
			},
			type: LINKED_DATA_SOURCES_EVENTS.RECEIVE_LINKED_DATA_SOURCES
		});
	} catch (e) {
		dispatch({
			payload: classFqn,
			type: LINKED_DATA_SOURCES_EVENTS.RECORD_LINKED_DATA_SOURCES_ERROR
		});
	}
};

export {
	fetchLinkedDataSources
};
