// @flow
import {CATALOG_ITEM_SETS_EVENTS} from './constants';
import type {SelectData} from 'store/customGroups/types';

type Leaf = {
	title: string,
	uuid: string,
};

export type Root = {
	children: Array<Leaf>,
	title: string,
	uuid: string
};

export type CatalogItemSetData = {
	error: boolean,
	items: Array<Root>,
	loading: boolean
};

export type CatalogItemSetsMap = {
	[property: string]: CatalogItemSetData
};

export type ReceivePayload = {
	data: Array<SelectData>,
	property: string
};

type ReceiveCatalogItemSetData = {
	payload: ReceivePayload,
	type: typeof CATALOG_ITEM_SETS_EVENTS.RECEIVE_CATALOG_ITEM_SET_DATA
};

type RecordCatalogItemSetDataError = {
	payload: string,
	type: typeof CATALOG_ITEM_SETS_EVENTS.RECORD_CATALOG_ITEM_SET_DATA_ERROR
};

type RequestCatalogItemSetData = {
	payload: string,
	type: typeof CATALOG_ITEM_SETS_EVENTS.REQUEST_CATALOG_ITEM_SET_DATA
};

type UnknownCatalogItemSetsAction = {
	type: typeof CATALOG_ITEM_SETS_EVENTS.UNKNOWN_CATALOG_ITEM_SETS_ACTION
};

export type CatalogItemSetsAction =
	| ReceiveCatalogItemSetData
	| RecordCatalogItemSetDataError
	| RequestCatalogItemSetData
	| UnknownCatalogItemSetsAction
;

export type CatalogItemSetsState = CatalogItemSetsMap;
