// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import {REF_ATTRIBUTES_EVENTS} from './constants';

const createRefKey = (attr: Attribute) => `${attr.metaClassFqn}$${attr.code}`;

/**
 * Получаем атрибуты ссылочного атрибута
 * @param {Attribute} refAttr - ссылочный атрибут
 * @returns {ThunkAction}
 */
const fetchRefAttributes = (refAttr: Attribute): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const key = createRefKey(refAttr);
	const {ref, ...attr} = refAttr;

	dispatch(requestRefAttributes(key));

	try {
		const {data} = await client.post(buildUrl('dashboards', 'getAttributesFromLinkAttribute', 'requestContent'), {
			linkAttribute: attr
		});

		dispatch(receiveRefAttributes(data, key));
	} catch (error) {
		dispatch(recordRefAttributesError(key));
	}
};

const requestRefAttributes = (payload: string) => ({
	type: REF_ATTRIBUTES_EVENTS.REQUEST_REF_ATTRIBUTES,
	payload
});

const receiveRefAttributes = (refAttributes: Array<Attribute>, refCode: string) => ({
	type: REF_ATTRIBUTES_EVENTS.RECEIVE_REF_ATTRIBUTES,
	payload: {refAttributes, refCode}
});

const recordRefAttributesError = (payload: string) => ({
	type: REF_ATTRIBUTES_EVENTS.RECORD_REF_ATTRIBUTES_ERROR,
	payload
});

export {
	createRefKey,
	fetchRefAttributes
};
