// @flow
import type {Attribute} from 'store/sources/attributes/types';

export type MapData = {
	error: boolean,
	loading: boolean,
	options: Attribute[],
};

export type LinkedAttributesMap = {
	[classes: string]: MapData
};

type RequestLinkedAttributes = {
	payload: {key: string},
	type: 'REQUEST_LINKED_ATTRIBUTES'
};

type ReceiveLinkedAttributes = {
	payload: {
		attributes: Attribute[],
		key: string
	},
	type: 'RECEIVE_LINKED_ATTRIBUTES'
};

type RequestLinkedAttributesError = {
	payload: {key: string},
	type: 'REQUEST_LINKED_ATTRIBUTES_ERROR'
};

type UnknownLinkedAttributes = {
	type: 'UNKNOWN_LINKED_ATTRIBUTES'
};

export type LinkedDataSourcesAction =
	| ReceiveLinkedAttributes
	| RequestLinkedAttributesError
	| RequestLinkedAttributes
	| UnknownLinkedAttributes
;

export type LinkedAttributesState = LinkedAttributesMap;
