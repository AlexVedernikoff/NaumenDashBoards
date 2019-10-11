// @flow
import {DATA_SOURCES_EVENTS} from './constants';

export type RawDataSource = {
	children: Array<RawDataSource>,
	classFqn: string,
	title: string
};

export type DataSource = {
	children: string[],
	errorLoadingChildren?: boolean,
	isLeaf: boolean,
	key: string,
	root?: boolean,
	title: string,
	value: string
};

export type DataSourceMap = {
	[key: string]: DataSource
};

export type ReceiveDataSources = {
	type: typeof DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES,
	payload: RawDataSource[]
};

export type RequestUserRole = {
	type: typeof DATA_SOURCES_EVENTS.REQUEST_USER_ROLE,
	payload: boolean
};

type RecordDataSourcesError = {
	type: typeof DATA_SOURCES_EVENTS.RECORD_DATA_SOURCES_ERROR
};

type RequestDataSources = {
	type: typeof DATA_SOURCES_EVENTS.REQUEST_DATA_SOURCES
};

type UnknownDataSourcesAction = {
	type: typeof DATA_SOURCES_EVENTS.UNKNOWN_DATA_SOURCES_ACTION
};

export type DataSourcesAction =
	| ReceiveDataSources
	| RecordDataSourcesError
	| RequestDataSources
	| RequestUserRole
	| UnknownDataSourcesAction
;

export type DataSourcesState = {
	error: boolean,
	loading: boolean,
	map: DataSourceMap,
	master: boolean
};
