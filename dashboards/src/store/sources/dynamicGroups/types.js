// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DYNAMIC_GROUPS_EVENTS} from './constants';
import type {ThunkAction} from 'src/store/types';
import type {TreeNode} from 'components/types';

export type DynamicGroup = {
	code: string,
	sourceName: string,
	sourceValue: string,
	title: string
};

export type DynamicGroupsNode = TreeNode<DynamicGroup | Attribute>;

export type DynamicGroupsMap = {
	[dataKey: string]: {
		data: {
			[key: string]: DynamicGroupsNode
		},
		error: boolean,
		loading: boolean
	}
};

type RequestDynamicAttributes = {
	payload: string,
	type: typeof DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTES
};

type RequestDynamicAttributeGroups = {
	payload: string,
	type: typeof DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTE_GROUPS
};

export type ReceiveDynamicAttributesPayload = {
	attributes: Attribute[],
	dataKey: string,
	groupCode: string
};

type ReceiveDynamicAttributes = {
	payload: ReceiveDynamicAttributesPayload,
	type: typeof DYNAMIC_GROUPS_EVENTS.RECEIVE_DYNAMIC_ATTRIBUTES
};

export type ReceiveDynamicAttributeGroupsPayload = {
	dataKey: string,
	groups: Array<DynamicGroup>
};

type ReceiveDynamicAttributeGroups = {
	payload: ReceiveDynamicAttributeGroupsPayload,
	type: typeof DYNAMIC_GROUPS_EVENTS.RECEIVE_DYNAMIC_ATTRIBUTE_GROUPS
};

type RecordDynamicAttributesError = {
	payload: string,
	type: typeof DYNAMIC_GROUPS_EVENTS.RECORD_DYNAMIC_ATTRIBUTES_ERROR
};

type RecordDynamicAttributeGroupsError = {
	payload: string,
	type: typeof DYNAMIC_GROUPS_EVENTS.RECORD_DYNAMIC_ATTRIBUTE_GROUPS_ERROR
};

type UnknownDynamicAttributesAction = {
	type: typeof DYNAMIC_GROUPS_EVENTS.UNKNOWN_DYNAMIC_GROUPS_ACTION
};

export type DynamicGroupsAction =
	| ReceiveDynamicAttributes
	| ReceiveDynamicAttributeGroups
	| RecordDynamicAttributesError
	| RecordDynamicAttributeGroupsError
	| RequestDynamicAttributeGroups
	| RequestDynamicAttributes
	| UnknownDynamicAttributesAction
;

export type DynamicGroupsState = DynamicGroupsMap;

export type FetchDynamicAttributeGroups = (dataKey: string, descriptor: string) => ThunkAction;

export type FetchDynamicAttributes = (dataKey: string, groupCode: string) => ThunkAction;
