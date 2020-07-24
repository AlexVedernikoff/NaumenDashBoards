// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DYNAMIC_GROUPS_EVENTS} from './constants';
import type {TreeNode} from 'components/types';

export type DynamicGroup = {
	code: string,
	sourceName: string,
	sourceValue: string,
	title: string
};

export type DynamicGroupsNode = TreeNode<DynamicGroup | Attribute>;

export type DynamicGroupsMap = {
	[key: string]: DynamicGroupsNode
};

type RequestDynamicAttributes = {
	payload: string,
	type: typeof DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTES
};

export type ReceiveDynamicAttributesPayload = {
	attributes: Attribute[],
	code: string
};

type ReceiveDynamicAttributes = {
	payload: ReceiveDynamicAttributesPayload,
	type: typeof DYNAMIC_GROUPS_EVENTS.RECEIVE_DYNAMIC_ATTRIBUTES
};

type RecordDynamicAttributesError = {
	payload: string,
	type: typeof DYNAMIC_GROUPS_EVENTS.RECORD_DYNAMIC_ATTRIBUTES_ERROR
};

type SetDynamicGroups = {
	payload: Array<DynamicGroup>,
	type: typeof DYNAMIC_GROUPS_EVENTS.SET_DYNAMIC_GROUPS
};

type UnknownDynamicAttributesAction = {
	type: typeof DYNAMIC_GROUPS_EVENTS.UNKNOWN_DYNAMIC_GROUPS_ACTION
};

export type DynamicGroupsAction =
	| ReceiveDynamicAttributes
	| RecordDynamicAttributesError
	| RequestDynamicAttributes
	| SetDynamicGroups
	| UnknownDynamicAttributesAction
;

export type DynamicGroupsState = DynamicGroupsMap;
