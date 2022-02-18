// @flow
import api from 'api';
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
		const data = await api.instance.dashboards.getCatalogObject(property);

		dispatch(receiveCatalogItemSetData({data, property}));
	} catch (error) {
		dispatch(recordCatalogItemSetDataError(property));
	}
};

const requestCatalogItemSetData = (payload: string) => ({payload, type: 'REQUEST_CATALOG_ITEM_SET_DATA'});

const recordCatalogItemSetDataError = (payload: string) => ({payload, type: 'RECORD_CATALOG_ITEM_SET_DATA_ERROR'});

const receiveCatalogItemSetData = (payload: ReceivePayload) => ({payload, type: 'RECEIVE_CATALOG_ITEM_SET_DATA'});

export {
	fetchCatalogItemSetData
};
