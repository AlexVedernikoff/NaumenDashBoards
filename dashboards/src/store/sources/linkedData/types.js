// @flow
import type {DataSource, DataSourceMap} from 'store/sources/data/types';
import {LINKED_DATA_SOURCES_EVENTS} from './constants';

export type LinkedDataSourceMap = {
	[classFqn: string]: DataSourceMap
};

export type ReceiveDataSources = {
	payload: {
		id: string,
		sources: DataSourceMap
	},
	type: typeof LINKED_DATA_SOURCES_EVENTS.RECEIVE_LINKED_DATA_SOURCES
};

type RecordDataSourcesError = {
	payload: string,
	type: typeof LINKED_DATA_SOURCES_EVENTS.RECORD_LINKED_DATA_SOURCES_ERROR
};

type RequestDataSources = {
	payload: DataSource,
	type: typeof LINKED_DATA_SOURCES_EVENTS.REQUEST_LINKED_DATA_SOURCES
};

type UnknownDataSourcesAction = {
	type: typeof LINKED_DATA_SOURCES_EVENTS.UNKNOWN_LINKED_DATA_SOURCES_ACTION
};

export type LinkedDataSourcesAction =
	| ReceiveDataSources
	| RecordDataSourcesError
	| RequestDataSources
	| UnknownDataSourcesAction
;

export type LinkedDataSourcesState = LinkedDataSourceMap;
