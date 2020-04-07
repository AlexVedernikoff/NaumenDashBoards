// @flow
import {CATALOG_ITEM_SETS_EVENTS} from './constants';
import type {SelectData} from 'store/customGroups/types';

type Leaf = {
	title: string,
	uuid: string,
};

export type Root = {
	title: string,
	uuid: string,
	children: Array<Leaf>
};

export type CatalogItemSetData = {
	items: Array<Root>,
	error: boolean,
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
	type: typeof CATALOG_ITEM_SETS_EVENTS.RECEIVE_CATALOG_ITEM_SET_DATA,
	payload: ReceivePayload
};

type RecordCatalogItemSetDataError = {
	type: typeof CATALOG_ITEM_SETS_EVENTS.RECORD_CATALOG_ITEM_SET_DATA_ERROR,
	payload: string
};

type RequestCatalogItemSetData = {
	type: typeof CATALOG_ITEM_SETS_EVENTS.REQUEST_CATALOG_ITEM_SET_DATA,
	payload: string
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
