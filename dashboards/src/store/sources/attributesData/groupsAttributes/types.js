// @flow
export type GroupsAttributesData = {
	error: boolean,
	items: Array<string>,
	loading: boolean
};

export type GroupsAttributesState = {
	[key: string]: GroupsAttributesData
};

export type ReceivePayload = {
	data: Array<string>,
	key: string
};

export type ReceiveGroupsAttributes = {payload: ReceivePayload, type: 'RECEIVE_GROUPS_ATTRIBUTES_ACTION'};

export type RequestGroupsAttributesError = {payload: string, type: 'REQUEST_GROUPS_ATTRIBUTES_ACTION_ERROR'};

export type RequestGroupsAttributes = {payload: string, type: 'REQUEST_GROUPS_ATTRIBUTES_ACTION'};

type UnknownGroupsAttributesAction = {type: 'UNKNOWN_GROUPS_ATTRIBUTES_ACTION'};

export type GroupsAttributesAction =
	| ReceiveGroupsAttributes
	| RequestGroupsAttributesError
	| RequestGroupsAttributes
	| UnknownGroupsAttributesAction
;
