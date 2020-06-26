// @flow
import {CATALOG_ITEMS_EVENTS} from './constants';

export type Data = {
	title: string,
	uuid: string
};

export type CatalogItemData = {
	error: boolean,
	items: Array<Data>,
	loading: boolean
};

export type CatalogItemsMap = {
	[property: string]: CatalogItemData
};

export type ReceivePayload = {
	data: Array<Data>,
	property: string
};

type ReceiveCatalogItemData = {
	payload: ReceivePayload,
	type: typeof CATALOG_ITEMS_EVENTS.RECEIVE_CATALOG_ITEM_DATA
};

type RecordCatalogItemDataError = {
	payload: string,
	type: typeof CATALOG_ITEMS_EVENTS.RECORD_CATALOG_ITEM_DATA_ERROR
};

type RequestCatalogItemData = {
	payload: string,
	type: typeof CATALOG_ITEMS_EVENTS.REQUEST_CATALOG_ITEM_DATA
};

type UnknownCatalogItemsAction = {
	type: typeof CATALOG_ITEMS_EVENTS.UNKNOWN_CATALOG_ITEMS_ACTION
};

export type CatalogItemsAction =
	| ReceiveCatalogItemData
	| RecordCatalogItemDataError
	| RequestCatalogItemData
	| UnknownCatalogItemsAction
;

export type CatalogItemsState = CatalogItemsMap;
