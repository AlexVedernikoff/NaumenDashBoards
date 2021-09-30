// @flow
import {arrayToTree} from 'utils/arrayToTree';
import type {CatalogItemsAction, CatalogItemsState} from './types';
import {CATALOG_ITEMS_EVENTS} from './constants';
import {defaultCatalogItemsAction, initialCatalogItemsState} from './init';

const reducer = (state: CatalogItemsState = initialCatalogItemsState, action: CatalogItemsAction = defaultCatalogItemsAction): CatalogItemsState => {
	switch (action.type) {
		case CATALOG_ITEMS_EVENTS.RECEIVE_CATALOG_ITEM_DATA:
			return {
				...state,
				[action.payload.property]: {
					...state[action.payload.property],
					items: arrayToTree(action.payload.data, {keys: {
						value: 'uuid'
					}}),
					loading: false
				}
			};
		case CATALOG_ITEMS_EVENTS.RECORD_CATALOG_ITEM_DATA_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case CATALOG_ITEMS_EVENTS.REQUEST_CATALOG_ITEM_DATA:
			return {
				...state,
				[action.payload]: {
					error: false,
					items: [],
					loading: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
