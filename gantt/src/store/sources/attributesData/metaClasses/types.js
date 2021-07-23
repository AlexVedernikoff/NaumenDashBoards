// @flow
import {META_CLASSES_EVENTS} from './constants';

export type Item = {
	title: string,
	uuid: string
};

export type MetaClassData = {
	error: boolean,
	items: Array<Item>,
	loading: boolean
};

export type MetaClassesMap = {
	[string]: MetaClassData
};

export type ReceivePayload = {
	data: Array<Item>,
	metaClassFqn: string
};

type ReceiveMetaClassData = {
	payload: ReceivePayload,
	type: typeof META_CLASSES_EVENTS.RECEIVE_META_CLASS_DATA
};

type RecordMetaClassDataError = {
	payload: string,
	type: typeof META_CLASSES_EVENTS.RECORD_META_CLASS_DATA_ERROR
};

type RequestMetaClassData = {
	payload: string,
	type: typeof META_CLASSES_EVENTS.REQUEST_META_CLASS_DATA
};

type UnknownMetaClassesAction = {
	type: typeof META_CLASSES_EVENTS.UNKNOWN_META_CLASSES_ACTION
};

export type MetaClassesAction =
	| ReceiveMetaClassData
	| RecordMetaClassDataError
	| RequestMetaClassData
	| UnknownMetaClassesAction
;

export type MetaClassesState = MetaClassesMap;
