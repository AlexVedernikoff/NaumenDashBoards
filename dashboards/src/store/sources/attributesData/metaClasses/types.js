// @flow
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

type ReceiveMetaClassData = {payload: ReceivePayload, type: 'RECEIVE_META_CLASS_DATA'};

type RecordMetaClassDataError = {payload: string, type: 'RECORD_META_CLASS_DATA_ERROR'};

type RequestMetaClassData = {payload: string, type: 'REQUEST_META_CLASS_DATA'};

type UnknownMetaClassesAction = { type: 'UNKNOWN_META_CLASSES_ACTION'};

export type MetaClassesAction =
	| ReceiveMetaClassData
	| RecordMetaClassDataError
	| RequestMetaClassData
	| UnknownMetaClassesAction
;

export type MetaClassesState = MetaClassesMap;
