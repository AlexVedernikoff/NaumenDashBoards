// @flow
import {ATTRIBUTES_EVENTS, SOURCE_ATTRIBUTE_TYPES} from './constants';

export type Attribute = {
	code: string,
	metaClassFqn: string,
	property: string,
	ref: Attribute | null,
	sourceCode: string,
	sourceName: string,
	title: string,
	type: $Keys<typeof SOURCE_ATTRIBUTE_TYPES>,
};

export type MapData = {
	options: Attribute[],
	error: boolean,
	loading: boolean,
	uploaded: boolean
};

export type AttributesMap = {
	[key: string]: MapData
};

type RequestAttributes = {
	type: typeof ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES,
	payload: string
};

type ReceiveAttributes = {
	type: typeof ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES,
	payload: {
		attributes: Attribute[],
		classFqn: string
	}
};

type RecordAttributesError = {
	type: typeof ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR,
	payload: string
};

type UnknownAttributesAction = {
	type: typeof ATTRIBUTES_EVENTS.UNKNOWN_ATTRIBUTES_ACTION,
	payload: null
};

export type AttributesAction =
	| ReceiveAttributes
	| RecordAttributesError
	| RequestAttributes
	| UnknownAttributesAction
;

export type AttributesState = AttributesMap;
