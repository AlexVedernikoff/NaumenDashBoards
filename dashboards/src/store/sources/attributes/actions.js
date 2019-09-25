// @flow
import {ATTRIBUTES_EVENTS} from './constants';
import axios from 'axios';
import {BASE_URL, KEY} from 'constants/api';
import type {Dispatch, ThunkAction} from 'store/types';

/**
 * Получаем атрибуты конкретного класса
 * @param {string} payload - fqn класса
 * @returns {ThunkAction}
 */
const fetchAttributes = (payload: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestAttributes());
	try {
		const {data} = await axios.post(`${BASE_URL}/exec-post?accessKey=${KEY}&func=modules.dashboards.getAttributesDataSources&params='${payload}'`);
		dispatch(receiveAttributes(data, payload));
	} catch (error) {
		dispatch(recordAttributesError(payload));
	}
};

const requestAttributes = () => ({
	type: ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES,
	payload: null
});

const receiveAttributes = (attributes, fqn) => ({
	type: ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES,
	payload: {attributes, fqn}
});

const recordAttributesError = (payload: string) => ({
	type: ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR,
	payload
});

export {
	fetchAttributes
};
