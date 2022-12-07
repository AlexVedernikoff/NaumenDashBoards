// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ThunkAction} from 'store/types';
import type {TreeNode} from 'components/types';

export type DynamicGroupInfo = {
	code: string,
	title: string
};

export type DynamicGroup = {
	...DynamicGroupInfo,
	sourceName: string,
	sourceValue: string,
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
	type: 'sources/dynamicAttributes/requestDynamicAttributes'
};

type RequestDynamicAttributeGroups = {
	payload: string,
	type: 'sources/dynamicAttributes/requestDynamicAttributeGroups'
};

export type ReceiveDynamicAttributesPayload = {
	attributes: Array<Attribute>,
	dataKey: string,
	groupCode: string
};

type ReceiveDynamicAttributes = {
	payload: ReceiveDynamicAttributesPayload,
	type: 'sources/dynamicAttributes/receiveDynamicAttributes'
};

export type ReceiveDynamicAttributeGroupsPayload = {
	dataKey: string,
	groups: Array<DynamicGroup>
};

type ReceiveDynamicAttributeGroups = {
	payload: ReceiveDynamicAttributeGroupsPayload,
	type: 'sources/dynamicAttributes/receiveDynamicAttributeGroups'
};

type RecordDynamicAttributesError = {
	payload: string,
	type: 'sources/dynamicAttributes/recordDynamicAttributesError'
};

type RecordDynamicAttributeGroupsError = {
	payload: string,
	type: 'sources/dynamicAttributes/recordDynamicAttributeGroupsError'
};

export type DynamicAttributesSearchItem = {
	attributes: Array<Attribute>,
	dynamicGroup: DynamicGroupInfo
};

export type ReceiveDynamicAttributesSearchPayload = {
	dataKey: string,
	groups: Array<DynamicAttributesSearchItem>
};

type ReceiveDynamicAttributesSearch = {
	payload: ReceiveDynamicAttributesSearchPayload,
	type: 'sources/dynamicAttributes/receiveDynamicAttributesSearch'
};

type ClearDynamicAttributeGroups = {
	payload: string,
	type: 'sources/dynamicAttributes/clearDynamicAttributeGroups'
};

type UnknownDynamicAttributesAction = {
	type: 'sources/dynamicAttributes/unknownDynamicGroupsAction'
};

export type DynamicGroupsAction =
	| ClearDynamicAttributeGroups
	| ReceiveDynamicAttributes
	| ReceiveDynamicAttributeGroups
	| RecordDynamicAttributesError
	| RecordDynamicAttributeGroupsError
	| RequestDynamicAttributeGroups
	| RequestDynamicAttributes
	| ReceiveDynamicAttributesSearch
	| UnknownDynamicAttributesAction
;

export type DynamicGroupsState = DynamicGroupsMap;

export type ClearDynamicAttributeGroupsAction = (dataKey: string) => ThunkAction;
