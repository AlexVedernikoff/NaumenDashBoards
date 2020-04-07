// @flow
import {buildUrl, client} from 'utils/api';
import {CATALOG_ITEM_SETS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import type {ReceivePayload} from './types';

/**
 * Получает данные атрибута типа catalogItemSet, найденные по свойству атрибута
 * @param {string} property - свойство атрибута
 * @returns {ThunkAction}
 */
const fetchCatalogItemSetData = (property: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestCatalogItemSetData(property));

	try {
		const {data} = await client.post(buildUrl('dashboards', 'getCatalogObject', 'requestContent'), {
			property
		});
		dispatch(receiveCatalogItemSetData({data, property}));
	} catch (error) {
		dispatch(recordCatalogItemSetDataError(property));
	}
};

const requestCatalogItemSetData = (payload: string) => ({
	type: CATALOG_ITEM_SETS_EVENTS.REQUEST_CATALOG_ITEM_SET_DATA,
	payload
});

const recordCatalogItemSetDataError = (payload: string) => ({
	type: CATALOG_ITEM_SETS_EVENTS.RECORD_CATALOG_ITEM_SET_DATA_ERROR,
	payload
});

const receiveCatalogItemSetData = (payload: ReceivePayload) => ({
	type: CATALOG_ITEM_SETS_EVENTS.RECEIVE_CATALOG_ITEM_SET_DATA,
	payload
});

export {
	fetchCatalogItemSetData
};
