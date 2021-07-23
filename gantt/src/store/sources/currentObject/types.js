// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {CURRENT_OBJECT_EVENTS} from './constants';
import type {TreeNode} from 'components/types';

export type Item = TreeNode<Attribute>;

export type ItemsMap = {
	[string]: Item
};

export type CurrentObjectData = {
	error: boolean,
	items: ItemsMap,
	loading: boolean
};

export type NodePayload = {
	parent: string,
	type: string
};

export type ReceiveNodesPayload = {
	attributes: Array<Attribute>,
	parent: string,
	type: string
};

export type ReceiveRootsPayload = {
	attributes: Array<Attribute>,
	type: string
};

type ReceiveNodes = {
	payload: ReceiveNodesPayload,
	type: typeof CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_NODES
};

type ReceiveRoots = {
	payload: ReceiveRootsPayload,
	type: typeof CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_ROOTS
};

type RecordNodesError = {
	payload: NodePayload,
	type: typeof CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_NODES_ERROR
};

type RecordRootsError = {
	payload: string,
	type: typeof CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_ROOTS_ERROR
};

type RequestNodes = {
	payload: NodePayload,
	type: typeof CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_NODES
};

type RequestRoots = {
	payload: string,
	type: typeof CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_ROOTS
};

type UnknownAction = {
	type: typeof CURRENT_OBJECT_EVENTS.UNKNOWN_CURRENT_OBJECT_ACTION
};

export type CurrentObjectAction =
	| ReceiveNodes
	| ReceiveRoots
	| RecordNodesError
	| RecordRootsError
	| RequestNodes
	| RequestRoots
	| UnknownAction
;

export type CurrentObjectState = {
	[attributeType: string]: CurrentObjectData
};
