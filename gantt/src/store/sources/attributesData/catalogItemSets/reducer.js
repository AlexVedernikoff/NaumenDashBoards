// @flow
import {arrayToTree} from 'utils/arrayToTree';
import type {CatalogItemSetsAction, CatalogItemSetsState} from './types';
import {CATALOG_ITEM_SETS_EVENTS} from './constants';
import {defaultCatalogItemSetsAction, initialCatalogItemSetsState} from './init';

const reducer = (
	state: CatalogItemSetsState = initialCatalogItemSetsState,
	action: CatalogItemSetsAction = defaultCatalogItemSetsAction
): CatalogItemSetsState => {
	switch (action.type) {
		case CATALOG_ITEM_SETS_EVENTS.RECEIVE_CATALOG_ITEM_SET_DATA:
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
		case CATALOG_ITEM_SETS_EVENTS.RECORD_CATALOG_ITEM_SET_DATA_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case CATALOG_ITEM_SETS_EVENTS.REQUEST_CATALOG_ITEM_SET_DATA:
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
