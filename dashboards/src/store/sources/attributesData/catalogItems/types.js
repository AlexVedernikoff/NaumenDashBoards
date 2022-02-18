// @flow
import type {TreeNode} from 'components/types';

export type Data = {
	title: string,
	uuid: string
};

export type CatalogItemTree = {
	[key: string]: TreeNode<Data>
};

export type CatalogItemData = {
	error: boolean,
	items: CatalogItemTree,
	loading: boolean
};

export type CatalogItemsMap = {
	[property: string]: CatalogItemData
};

export type ReceivePayload = {
	data: Array<Data>,
	property: string
};

type ReceiveCatalogItemData = {payload: ReceivePayload, type: 'RECEIVE_CATALOG_ITEM_DATA'};

type RecordCatalogItemDataError = {payload: string, type: 'RECORD_CATALOG_ITEM_DATA_ERROR'};

type RequestCatalogItemData = {payload: string, type: 'REQUEST_CATALOG_ITEM_DATA'};

type UnknownCatalogItemsAction = { type: 'UNKNOWN_CATALOG_ITEMS_ACTION'};

export type CatalogItemsAction =
	| ReceiveCatalogItemData
	| RecordCatalogItemDataError
	| RequestCatalogItemData
	| UnknownCatalogItemsAction
;

export type CatalogItemsState = CatalogItemsMap;
