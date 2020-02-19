// @flow
import {ATTRIBUTES_DATA_EVENTS} from './constants';

export type Data = {
	title: string,
	uuid: string
};

export type AttributeData = {
	data: Array<Data>,
	error: boolean,
	loading: boolean,
	uploaded: boolean
};

export type AttributesDataMap = {
	[string]: AttributeData
};

export type ReceivePayload = {
	data: Array<Data>,
	key: string
};

type ReceiveActualValues = {
	type: typeof ATTRIBUTES_DATA_EVENTS.RECEIVE_ACTUAL_VALUES,
	payload: ReceivePayload
};

type ReceiveAllValues = {
	type: typeof ATTRIBUTES_DATA_EVENTS.RECEIVE_ALL_VALUES,
	payload: ReceivePayload
};

type ReceiveStates = {
	type: typeof ATTRIBUTES_DATA_EVENTS.RECEIVE_STATES,
	payload: ReceivePayload
};

type ReceiveMetaClasses = {
	type: typeof ATTRIBUTES_DATA_EVENTS.RECEIVE_META_CLASSES,
	payload: ReceivePayload
};

type RecordActualValuesError = {
	type: typeof ATTRIBUTES_DATA_EVENTS.RECORD_ACTUAL_VALUES_ERROR,
	payload: string
};

type RecordAllValuesError = {
	type: typeof ATTRIBUTES_DATA_EVENTS.RECORD_ALL_VALUES_ERROR,
	payload: string
};

type RecordMetaClassesError = {
	type: typeof ATTRIBUTES_DATA_EVENTS.RECORD_META_CLASSES_ERROR,
	payload: string
};

type RecordStatesError = {
	type: typeof ATTRIBUTES_DATA_EVENTS.RECORD_STATES_ERROR,
	payload: string
};

type RequestActualValues = {
	type: typeof ATTRIBUTES_DATA_EVENTS.REQUEST_ACTUAL_VALUES,
	payload: string
};

type RequestAllValues = {
	type: typeof ATTRIBUTES_DATA_EVENTS.REQUEST_ALL_VALUES,
	payload: string
};

type RequestStates = {
	type: typeof ATTRIBUTES_DATA_EVENTS.REQUEST_STATES,
	payload: string
};

type RequestMetaClasses = {
	type: typeof ATTRIBUTES_DATA_EVENTS.REQUEST_META_CLASSES,
	payload: string
};

type SetUploadedActualValues = {
	type: typeof ATTRIBUTES_DATA_EVENTS.SET_UPLOADED_ACTUAL_VALUES,
	payload: string
};

type SetUploadedAllValues = {
	type: typeof ATTRIBUTES_DATA_EVENTS.SET_UPLOADED_ALL_VALUES,
	payload: string
};

type UnknownAttributesDataAction = {
	type: typeof ATTRIBUTES_DATA_EVENTS.UNKNOWN_ATTRIBUTES_DATA_ACTION
};

export type AttributesDataAction =
	| ReceiveActualValues
	| ReceiveAllValues
	| ReceiveMetaClasses
	| ReceiveStates
	| RecordActualValuesError
	| RecordAllValuesError
	| RecordMetaClassesError
	| RecordStatesError
	| RequestActualValues
	| RequestAllValues
	| RequestStates
	| RequestMetaClasses
	| SetUploadedActualValues
	| SetUploadedAllValues
	| UnknownAttributesDataAction
;

export type AttributesDataState = {
	actualValues: AttributesDataMap,
	allValues: AttributesDataMap,
	metaClasses: AttributesDataMap,
	states: AttributesDataMap
};
