// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {OnLoadCallback} from 'store/sources/types';
import {REF_ATTRIBUTES_EVENTS} from './constants';
import type {ThunkAction} from 'store/types';

type RequestRefAttributes = {
	payload: string,
	type: typeof REF_ATTRIBUTES_EVENTS.REQUEST_REF_ATTRIBUTES
};

type ReceiveRefAttributes = {
	payload: {
		refAttributes: Attribute[],
		refCode: string
	},
	type: typeof REF_ATTRIBUTES_EVENTS.RECEIVE_REF_ATTRIBUTES
};

type RecordRefAttributesError = {
	payload: string,
	type: typeof REF_ATTRIBUTES_EVENTS.RECORD_REF_ATTRIBUTES_ERROR
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

export type RefAttributesState = AttributesMap;

export type FetchRefAttributes = (refAttr: Attribute, onLoadCallback?: OnLoadCallback) => ThunkAction;
