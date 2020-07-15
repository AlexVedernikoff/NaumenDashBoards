// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {OnLoadCallback} from 'store/sources/types';
import {REF_ATTRIBUTES_EVENTS} from './constants';

const createRefKey = (attribute: Attribute) => `${attribute.metaClassFqn}$${attribute.code}`;

/**
 * Получаем атрибуты ссылочного атрибута
 * @param {Attribute} refAttr - ссылочный атрибут
 * @param {OnLoadCallback?} onLoadCallback - возвращает полученные атрибуты
 * @returns {ThunkAction}
 */
const fetchRefAttributes = (refAttr: Attribute, onLoadCallback?: OnLoadCallback): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const key = createRefKey(refAttr);
	const {ref, ...attribute} = refAttr;

	dispatch(requestRefAttributes(key));

	try {
		const {data} = await client.post(buildUrl('dashboards', 'getAttributesFromLinkAttribute', 'requestContent'), {
			attribute
		});

		onLoadCallback && onLoadCallback(data);
		dispatch(receiveRefAttributes(data, key));
	} catch (error) {
		dispatch(recordRefAttributesError(key));
	}
};

const requestRefAttributes = (payload: string) => ({
	payload,
	type: REF_ATTRIBUTES_EVENTS.REQUEST_REF_ATTRIBUTES
});

const receiveRefAttributes = (refAttributes: Array<Attribute>, refCode: string) => ({
	payload: {refAttributes, refCode},
	type: REF_ATTRIBUTES_EVENTS.RECEIVE_REF_ATTRIBUTES
});

const recordRefAttributesError = (payload: string) => ({
	payload,
	type: REF_ATTRIBUTES_EVENTS.RECORD_REF_ATTRIBUTES_ERROR
});

export {
	createRefKey,
	fetchRefAttributes
};
