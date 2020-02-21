// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {REF_ATTRIBUTES_EVENTS} from './constants';

export type OnLoadCallback = (Array<Attribute>) => void;

export type RefAttributeData = {
	data: Array<Attribute>,
	error: boolean,
	loading: boolean
};

export type RefAttributesMap = {
	[key: string]: RefAttributeData
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

export type RefAttributesState = RefAttributesMap;
