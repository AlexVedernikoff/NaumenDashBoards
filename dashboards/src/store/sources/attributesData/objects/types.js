// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Source} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';
import type {TreeNode} from 'components/types';

export type ClearSearchObjectsAction = (source: Source, attribute: Attribute) => ThunkAction;

export type SearchObjectsAction = (source: Source, attribute: Attribute, value: string, includingArchival: boolean) => ThunkAction;

export type RawObjectData = {
	children: number,
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
	includingArchival: boolean,
	offset: number,
	parentUUID: string | null,
	source: Source
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
	type: 'CHANGE_SEARCH_VALUE'
};

type FoundObjectsFulfilled = {
	payload: {
		id: string,
		items: ItemsMap
	},
	type: 'FOUND_OBJECTS_FULFILLED'
};

type ClearFoundObjects = {payload: string, type: 'FOUND_OBJECTS_CLEAR_SEARCH'};

type FoundObjectsPending = {
	payload: {
		id: string,
		searchValue: string
	},
	type: 'FOUND_OBJECTS_PENDING'
};

type FoundObjectsRejected = {payload: string, type: 'FOUND_OBJECT_REJECTED'};

type ObjectDataFulfilled = {payload: ReceivePayload, type: 'OBJECT_DATA_FULFILLED'};

type ObjectDataPending = {payload: Payload, type: 'OBJECT_DATA_PENDING'};

type ObjectDataRejected = {payload: Payload, type: 'OBJECT_DATA_REJECTED'};

type UnknownObjectsAction = {type: 'UNKNOWN_OBJECTS_ACTION'};

export type ObjectsAction =
	| ChangeSearchValue
	| ClearFoundObjects
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
