// @flow
import {ATTRIBUTES_EVENTS} from './constants';

export type Attribute = {
	code: string,
	title: string,
	type: string,
};

export type AttributeMap = {
	[key: string]: Attribute[]
};

type RequestAttributes = {
	type: typeof ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES,
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
	error: boolean,
	loading: boolean,
	map: AttributeMap
};
