// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {LINKED_DATA_SOURCES_EVENTS} from './constants';
import type {RawDataSource} from './types';

/**
 * Возвращает ссылочные источники
 * @param {string} classFqn - код источника
 * @returns {ThunkAction}
 */
const fetchLinkedDataSources = (classFqn: string): ThunkAction => async (dispatch: Dispatch) => {
	dispatch(requestDataSources(classFqn));

	try {
		const {backBOLinks, boLinks, object} = ATTRIBUTE_TYPES;
		const payload = {
			classFqn,
			types: [backBOLinks, boLinks, object]
		};
		const sources = await window.jsApi.restCallModule('dashboards', 'getLinkedDataSources', payload);

		dispatch(receiveDataSources(classFqn, sources));
	} catch (e) {
		dispatch(recordErrorDataSources(classFqn));
	}
};

const receiveDataSources = (classFqn: string, sources: RawDataSource) => ({
	payload: {
		classFqn,
		sources
	},
	type: LINKED_DATA_SOURCES_EVENTS.RECEIVE_LINKED_DATA_SOURCES
});

const recordErrorDataSources = (payload: string) => ({
	payload,
	type: LINKED_DATA_SOURCES_EVENTS.RECORD_LINKED_DATA_SOURCES_ERROR
});

const requestDataSources = (payload: string) => ({
	payload,
	type: LINKED_DATA_SOURCES_EVENTS.REQUEST_LINKED_DATA_SOURCES
});

export {
	fetchLinkedDataSources
};
