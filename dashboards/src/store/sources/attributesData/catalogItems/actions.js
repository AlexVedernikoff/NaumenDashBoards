// @flow
import api from 'api';
import {CATALOG_ITEMS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import type {ReceivePayload} from './types';

/**
 * Получает данные атрибута типа catalogItem, найденные по свойству атрибута
 * @param {string} property - свойство атрибута
 * @returns {ThunkAction}
 */
const fetchCatalogItemData = (property: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestCatalogItemData(property));

	try {
		const data = await api.dashboards.getCatalogItemObject(property);

		dispatch(receiveCatalogItemData({data, property}));
	} catch (error) {
		dispatch(recordCatalogItemDataError(property));
	}
};

const requestCatalogItemData = (payload: string) => ({
	payload,
	type: CATALOG_ITEMS_EVENTS.REQUEST_CATALOG_ITEM_DATA
});

const recordCatalogItemDataError = (payload: string) => ({
	payload,
	type: CATALOG_ITEMS_EVENTS.RECORD_CATALOG_ITEM_DATA_ERROR
});

const receiveCatalogItemData = (payload: ReceivePayload) => ({
	payload,
	type: CATALOG_ITEMS_EVENTS.RECEIVE_CATALOG_ITEM_DATA
});

export {
	fetchCatalogItemData
};
