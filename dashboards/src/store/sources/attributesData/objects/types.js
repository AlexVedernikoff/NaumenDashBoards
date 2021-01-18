// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {OBJECTS_EVENTS} from './constants';
import type {Source} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';
import type {TreeNode} from 'components/types';

export type SearchObjects = (source: Source, attribute: Attribute, value: string) => ThunkAction;

export type RawObjectData = {
	children: Array<RawObjectData>,
	hasChildren: boolean,
	title: string,
	uuid: string
};

type ItemValue = {
	title: string,
	uuid: string
};

export type ItemsMap = {
	[string]: TreeNode<ItemValue>
};

export type ObjectData = {
	error: boolean,
	items: ItemsMap,
	loading: boolean,
	uploaded: boolean
};

export type ObjectsMap = {
	[string]: ObjectData
};

export type FoundData = {
	...ObjectData,
	searchValue: string
};

type FoundMap = {
	[string]: FoundData
};

export type FetchParams = {
	attribute: Attribute,
	offset: number,
	parentUUID: string | null,
	source: Source,
	type: string
};

export type Payload = {
	id: string,
	parentUUID: string | null,
	type: string
};

export type ReceivePayload = {
	...Payload,
	data: Array<RawObjectData>,
	uploaded: boolean
};

type ChangeSearchValue = {
	payload: {
		id: string,
		searchValue: string
	},
	type: typeof OBJECTS_EVENTS.CHANGE_SEARCH_VALUE
};

type FoundObjectsFulfilled = {
	payload: {
		id: string,
		items: ItemsMap
	},
	type: typeof OBJECTS_EVENTS.FOUND_OBJECTS_FULFILLED
};

type FoundObjectsPending = {
	payload: {
		id: string,
		searchValue: string
	},
	type: typeof OBJECTS_EVENTS.FOUND_OBJECTS_PENDING
};

type FoundObjectsRejected = {
	payload: string,
	type: typeof OBJECTS_EVENTS.FOUND_OBJECT_REJECTED
};

type ObjectDataFulfilled = {
	payload: ReceivePayload,
	type: typeof OBJECTS_EVENTS.OBJECT_DATA_FULFILLED
};

type ObjectDataPending = {
	payload: Payload,
	type: typeof OBJECTS_EVENTS.OBJECT_DATA_PENDING
};

type ObjectDataRejected = {
	payload: Payload,
	type: typeof OBJECTS_EVENTS.OBJECT_DATA_REJECTED
};

type UnknownObjectsAction = {
	type: typeof OBJECTS_EVENTS.UNKNOWN_OBJECTS_ACTION
};

export type ObjectsAction =
	| ChangeSearchValue
	| FoundObjectsFulfilled
	| FoundObjectsPending
	| FoundObjectsRejected
	| ObjectDataFulfilled
	| ObjectDataPending
	| ObjectDataRejected
	| UnknownObjectsAction
;

export type ObjectsState = {
	actual: ObjectsMap,
	all: ObjectsMap,
	found: FoundMap
};
