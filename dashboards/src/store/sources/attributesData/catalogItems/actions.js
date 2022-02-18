// @flow
import api from 'api';
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
		const data = await api.instance.dashboards.getCatalogItemObject(property);

		dispatch(receiveCatalogItemData({data, property}));
	} catch (error) {
		dispatch(recordCatalogItemDataError(property));
	}
};

const requestCatalogItemData = (payload: string) => ({payload, type: 'REQUEST_CATALOG_ITEM_DATA'});

const recordCatalogItemDataError = (payload: string) => ({payload, type: 'RECORD_CATALOG_ITEM_DATA_ERROR'});

const receiveCatalogItemData = (payload: ReceivePayload) => ({payload, type: 'RECEIVE_CATALOG_ITEM_DATA'});

export {
	fetchCatalogItemData
};
