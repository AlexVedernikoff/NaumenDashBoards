// @flow
import {arrayToTree} from 'utils/arrayToTree';
import type {CatalogItemSetsAction, CatalogItemSetsState} from './types';
import {defaultCatalogItemSetsAction, initialCatalogItemSetsState} from './init';

const reducer = (
	state: CatalogItemSetsState = initialCatalogItemSetsState,
	action: CatalogItemSetsAction = defaultCatalogItemSetsAction
): CatalogItemSetsState => {
	switch (action.type) {
		case 'RECEIVE_CATALOG_ITEM_SET_DATA':
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
		case 'RECORD_CATALOG_ITEM_SET_DATA_ERROR':
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case 'REQUEST_CATALOG_ITEM_SET_DATA':
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
