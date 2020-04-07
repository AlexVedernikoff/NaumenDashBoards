// @flow
import type {CatalogItemsAction, CatalogItemsState} from './types';
import {CATALOG_ITEMS_EVENTS} from './constants';

export const initialCatalogItemsState: CatalogItemsState = {};

export const defaultCatalogItemsAction: CatalogItemsAction = {
	type: CATALOG_ITEMS_EVENTS.UNKNOWN_CATALOG_ITEMS_ACTION
};
