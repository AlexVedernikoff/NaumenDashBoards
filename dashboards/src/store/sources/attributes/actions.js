// @flow
import {ATTRIBUTES_EVENTS} from './constants';
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {OnLoadCallback} from 'store/sources/types';

/**
 * Получаем атрибуты конкретного класса
 * @param {string} classFqn - код класса
 * @param {OnLoadCallback} callback - колбэк-функция
 * @returns {ThunkAction}
 */
const fetchAttributes = (classFqn: string, callback?: OnLoadCallback): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestAttributes(classFqn));

	try {
		const url = buildUrl('dashboards', 'getDataSourceAttributes', 'requestContent');
		const data = {
			classFqn
		};
		const {data: attributes} = await client.post(url, data);

		callback && callback(attributes);
		dispatch(receiveAttributes(attributes, classFqn));
	} catch (error) {
		dispatch(recordAttributesError(classFqn));
	}
};

const requestAttributes = (payload: string) => ({
	type: ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES,
	payload
});

const receiveAttributes = (attributes, classFqn) => ({
	type: ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES,
	payload: {attributes, classFqn}
});

const recordAttributesError = (payload: string) => ({
	type: ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR,
	payload
});

export {
	fetchAttributes
};
