// @flow
import {DATA_SOURCES_EVENTS} from './constants';

export type RawDataSource = {
	children: Array<RawDataSource>,
	classFqn: string,
	title: string
};

export type DataSource = {
	children: Array<string> | null,
	label: string,
	root: boolean,
	uploaded: true,
	value: string
};

export type DataSourceMap = {
	[key: string]: DataSource
};

export type ReceiveDataSources = {
	type: typeof DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES,
	payload: RawDataSource[]
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
	| UnknownDataSourcesAction
;

export type DataSourcesState = {
	error: boolean,
	loading: boolean,
	map: DataSourceMap
};
