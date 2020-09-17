// @flow
import {ATTRIBUTES_EVENTS} from './constants';
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
		const attributes = await window.jsApi.restCallModule('dashboards', 'getDataSourceAttributes', {classFqn});

		callback && callback(attributes);
		dispatch(receiveAttributes(attributes, classFqn));
	} catch (error) {
		dispatch(recordAttributesError(classFqn));
	}
};

const requestAttributes = (payload: string) => ({
	payload,
	type: ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES
});

const receiveAttributes = (attributes, classFqn) => ({
	payload: {attributes, classFqn},
	type: ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES
});

const recordAttributesError = (payload: string) => ({
	payload,
	type: ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR
});

export {
	fetchAttributes
};
