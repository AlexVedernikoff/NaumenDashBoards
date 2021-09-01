// @flow
import {ATTRIBUTES_EVENTS, SOURCE_ATTRIBUTE_TYPES} from './constants';
import type {OnLoadCallback} from 'store/sources/types';
import type {ThunkAction} from 'store/types';

export type Attribute = {
	code: string,
	declaredMetaClass: ?string,
	label?: string,
	metaClassFqn: string,
	property: string,
	ref: Attribute | null,
	sourceCode: string,
	sourceName: string,
	title: string,
	type: $Keys<typeof SOURCE_ATTRIBUTE_TYPES>,
	value?: string
};

export type MapData = {
	error: boolean,
	loading: boolean,
	options: Attribute[],
	uploaded: boolean
};

export type AttributesMap = {
	[key: string]: MapData
};

type RequestAttributes = {
	payload: string,
	type: typeof ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES
};

type ReceiveAttributes = {
	payload: {
		attributes: Attribute[],
		classFqn: string
	},
	type: typeof ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES
};

type RecordAttributesError = {
	payload: string,
	type: typeof ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR
};

type UnknownAttributesAction = {
	payload: null,
	type: typeof ATTRIBUTES_EVENTS.UNKNOWN_ATTRIBUTES_ACTION
};

export type AttributesAction =
	| ReceiveAttributes
	| RecordAttributesError
	| RequestAttributes
	| UnknownAttributesAction
;

export type AttributesState = AttributesMap;

export type FetchAttributes = (classFqn: string, parentClassFqn?: string | null, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchAttributeByCode = (classFqn: string, attribute: Attribute) => ThunkAction;
