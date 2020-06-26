// @flow
import {OBJECTS_EVENTS} from './constants';
import type {TreeNode} from 'components/types';

export type RawObjectData = {
	children: number,
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

export type FetchParams = {
	actual: boolean,
	offset: number,
	parentUUID: string | null,
	property: string
};

export type Payload = {
	parentUUID: string | null,
	property: string
};

export type ReceivePayload = {
	...Payload,
	data: Array<RawObjectData>,
	uploaded: boolean
};

type ReceiveActualObjectData = {
	payload: ReceivePayload,
	type: typeof OBJECTS_EVENTS.RECEIVE_ACTUAL_OBJECT_DATA
};

type ReceiveAllObjectData = {
	payload: ReceivePayload,
	type: typeof OBJECTS_EVENTS.RECEIVE_ALL_OBJECT_DATA
};

type RecordActualObjectDataError = {
	payload: Payload,
	type: typeof OBJECTS_EVENTS.RECORD_ACTUAL_OBJECT_DATA_ERROR
};

type RecordAllObjectDataError = {
	payload: Payload,
	type: typeof OBJECTS_EVENTS.RECORD_ALL_OBJECT_DATA_ERROR
};

type RequestActualObjectData = {
	payload: Payload,
	type: typeof OBJECTS_EVENTS.REQUEST_ACTUAL_OBJECT_DATA
};

type RequestAllObjectData = {
	payload: Payload,
	type: typeof OBJECTS_EVENTS.REQUEST_ALL_OBJECT_DATA
};

type UnknownObjectsAction = {
	type: typeof OBJECTS_EVENTS.UNKNOWN_OBJECTS_ACTION
};

export type ObjectsAction =
	| ReceiveActualObjectData
	| ReceiveAllObjectData
	| RecordActualObjectDataError
	| RecordAllObjectDataError
	| RequestActualObjectData
	| RequestAllObjectData
	| UnknownObjectsAction
;

export type ObjectsState = {
	actual: ObjectsMap,
	all: ObjectsMap
};
