// @flow
import {META_CLASSES_EVENTS} from './constants';

export type Item = {
	title: string,
	uuid: string
};

export type MetaClassData = {
	items: Array<Item>,
	error: boolean,
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
	type: typeof META_CLASSES_EVENTS.RECEIVE_META_CLASS_DATA,
	payload: ReceivePayload
};

type RecordMetaClassDataError = {
	type: typeof META_CLASSES_EVENTS.RECORD_META_CLASS_DATA_ERROR,
	payload: string
};

type RequestMetaClassData = {
	type: typeof META_CLASSES_EVENTS.REQUEST_META_CLASS_DATA,
	payload: string
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
