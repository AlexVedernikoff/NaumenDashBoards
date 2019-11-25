// @flow
import {ATTRIBUTES_EVENTS} from './constants';

export type Attribute = {
	code: string,
	metaClassFqn: string,
	property: string,
	ref: Attribute | null,
	sourceName: string,
	title: string,
	type: string,
};

export type AttributeData = {
	data: Attribute[],
	error: boolean,
	loading: boolean
}

export type AttributeMap = {
	[key: string]: AttributeData
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

export type AttributesState = {
	map: AttributeMap
};
