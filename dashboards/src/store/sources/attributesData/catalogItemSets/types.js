// @flow
import type {SelectData} from 'store/customGroups/types';
import type {TreeNode} from 'components/types';

export type CatalogItem = {
	title: string,
	uuid: string
};

export type RawCatalogItem = {
	...CatalogItem,
	children: Array<RawCatalogItem>
};

export type CatalogItemNode = TreeNode<CatalogItem>;

export type CatalogItemTree = {
	[key: string]: CatalogItemNode
};

export type CatalogItemSetData = {
	error: boolean,
	items: CatalogItemTree,
	loading: boolean
};

export type CatalogItemSetsMap = {
	[property: string]: CatalogItemSetData
};

export type ReceivePayload = {
	data: Array<SelectData>,
	property: string
};

type ReceiveCatalogItemSetData = {payload: ReceivePayload, type: 'RECEIVE_CATALOG_ITEM_SET_DATA'};

type RecordCatalogItemSetDataError = {payload: string, type: 'RECORD_CATALOG_ITEM_SET_DATA_ERROR'};

type RequestCatalogItemSetData = {payload: string, type: 'REQUEST_CATALOG_ITEM_SET_DATA'};

type UnknownCatalogItemSetsAction = { type: 'UNKNOWN_CATALOG_ITEM_SETS_ACTION'};

export type CatalogItemSetsAction =
	| ReceiveCatalogItemSetData
	| RecordCatalogItemSetDataError
	| RequestCatalogItemSetData
	| UnknownCatalogItemSetsAction
;

export type CatalogItemSetsState = CatalogItemSetsMap;
