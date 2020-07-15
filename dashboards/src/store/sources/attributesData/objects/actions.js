// @flow
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {FetchParams, Payload, ReceivePayload} from './types';
import {LIMIT, OBJECTS_EVENTS} from './constants';

/**
 * Вызывает необходимый метод получения данных для ссылочного атрибута
 * @param {Function} request - экшен запроса
 * @param {Function} receive - экшен получения данных атрибута
 * @param {Function} recordError - экшен записи ошибки
 * @returns {ThunkAction}
 */
const fetch = (request, receive, recordError) => (params: FetchParams): ThunkAction => async (dispatch: Dispatch) => {
	const {
		actual,
		offset = 0,
		parentUUID = null,
		property
	} = params;
	const payload = {
		parentUUID,
		property
	};

	dispatch(request(payload));

	try {
		const params = {
			count: LIMIT,
			offset,
			parentUUID,
			property,
			removed: !actual
		};
		const {data} = await client.post(buildUrl('dashboards', 'getAttributeObject', 'requestContent'), params);
		const uploaded = data.length < LIMIT;

		dispatch(receive({...payload, data, uploaded}));
	} catch (error) {
		dispatch(recordError(payload));
	}
};

const fetchObjectData = (params: FetchParams) => params.actual
	? fetch(requestActualData, receiveActualData, recordActualDataError)(params)
	: fetch(requestAllData, receiveAllObjectData, recordAllObjectDataError)(params);

const requestActualData = (payload: Payload) => ({
	payload,
	type: OBJECTS_EVENTS.REQUEST_ACTUAL_OBJECT_DATA
});

const requestAllData = (payload: Payload) => ({
	payload,
	type: OBJECTS_EVENTS.REQUEST_ALL_OBJECT_DATA
});

const recordActualDataError = (payload: Payload) => ({
	payload,
	type: OBJECTS_EVENTS.RECORD_ACTUAL_OBJECT_DATA_ERROR
});

const recordAllObjectDataError = (payload: Payload) => ({
	payload,
	type: OBJECTS_EVENTS.RECORD_ALL_OBJECT_DATA_ERROR
});

const receiveActualData = (payload: ReceivePayload) => ({
	payload,
	type: OBJECTS_EVENTS.RECEIVE_ACTUAL_OBJECT_DATA
});

const receiveAllObjectData = (payload: ReceivePayload) => ({
	payload,
	type: OBJECTS_EVENTS.RECEIVE_ALL_OBJECT_DATA
});

export {
	fetchObjectData
};
