// @flow
import type {CatalogItemSetsAction, CatalogItemSetsState} from './types';
import {CATALOG_ITEM_SETS_EVENTS} from './constants';

export const initialCatalogItemSetsState: CatalogItemSetsState = {};

export const defaultCatalogItemSetsAction: CatalogItemSetsAction = {
	type: CATALOG_ITEM_SETS_EVENTS.UNKNOWN_CATALOG_ITEM_SETS_ACTION
};
