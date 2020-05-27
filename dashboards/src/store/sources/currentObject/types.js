// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {CURRENT_OBJECT_EVENTS} from './constants';
import type {TreeNode} from 'components/types';

export type Item = TreeNode<Attribute>;

export type ItemsMap = {
	[string]: Item
};

export type TypeData = {
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
	type: typeof CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_NODES,
	payload: ReceiveNodesPayload
};

type ReceiveRoots = {
	type: typeof CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_ROOTS,
	payload: ReceiveRootsPayload
};

type RecordNodesError = {
	type: typeof CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_NODES_ERROR,
	payload: NodePayload
};

type RecordRootsError = {
	type: typeof CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_ROOTS_ERROR,
	payload: string
};

type RequestNodes = {
	type: typeof CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_NODES,
	payload: NodePayload
};

type RequestRoots = {
	type: typeof CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_ROOTS,
	payload: string
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
	[attributeType: string]: TypeData
};
