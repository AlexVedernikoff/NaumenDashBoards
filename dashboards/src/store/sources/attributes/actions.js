// @flow
import {ATTRIBUTES_EVENTS} from './constants';
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';

/**
 * Получаем атрибуты конкретного класса
 * @param {string} payload - classFqn
 * @returns {ThunkAction}
 */
const fetchAttributes = (payload: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestAttributes());
	try {
		const {data} = await client.post(buildUrl('dashboards', 'getAttributesDataSources', `'${payload}'`));
		dispatch(receiveAttributes(data, payload));
	} catch (error) {
		dispatch(recordAttributesError(payload));
	}
};

const requestAttributes = () => ({
	type: ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES,
	payload: null
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
