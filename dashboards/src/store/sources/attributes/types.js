// @flow
import type {AttrSetConditions} from 'utils/descriptorUtils/types';
import {ATTRIBUTES_EVENTS, SOURCE_ATTRIBUTE_TYPES, TIMER_VALUE} from './constants';
import type {OnLoadCallback} from 'store/sources/types';
import type {ThunkAction} from 'store/types';

export type Attribute = {
	ableForAvg: ?boolean,
	code: string,
	declaredMetaClass: ?string,
	metaClassFqn: string,
	property: string,
	ref: Attribute | null,
	sourceCode: string,
	sourceName: string,
	timerValue: ?$Keys<typeof TIMER_VALUE>,
	title: string,
	type: $Keys<typeof SOURCE_ATTRIBUTE_TYPES>,
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

export type FetchAttributes = (
	classFqn: string,
	parentClassFqn?: ?string,
	attrSetConditions: ?AttrSetConditions,
	onLoadCallback?: OnLoadCallback
) => ThunkAction;

export type FetchAttributeByCode = (classFqn: string, attribute: Attribute) => ThunkAction;
