// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {REF_ATTRIBUTES_EVENTS} from './constants';

export type AttributeData = {
	data: Attribute[],
	error: boolean,
	loading: boolean
}

export type AttributeMap = {
	[key: string]: AttributeData
};

type RequestRefAttributes = {
	type: typeof REF_ATTRIBUTES_EVENTS.REQUEST_REF_ATTRIBUTES,
	payload: string
};

type ReceiveRefAttributes = {
	type: typeof REF_ATTRIBUTES_EVENTS.RECEIVE_REF_ATTRIBUTES,
	payload: {
		refAttributes: Attribute[],
		refCode: string
	}
};

type RecordRefAttributesError = {
	type: typeof REF_ATTRIBUTES_EVENTS.RECORD_REF_ATTRIBUTES_ERROR,
	payload: string
};

type UnknownRefAttributesAction = {
	type: typeof REF_ATTRIBUTES_EVENTS.UNKNOWN_REF_ATTRIBUTES_ACTION
};

export type RefAttributesAction =
	| ReceiveRefAttributes
	| RecordRefAttributesError
	| RequestRefAttributes
	| UnknownRefAttributesAction
;

export type RefAttributesState = AttributeMap;
