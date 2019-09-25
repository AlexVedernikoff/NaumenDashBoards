// @flow
import {DATA_SOURCES_EVENTS} from './constants';

export type RawDataSource = {
	countChildren: number,
	fqnCode: string,
	title: string
};

export type DataSource = {
	children?: string[],
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

export type ReceiveDataSourcesPayload = {
	dataSources: RawDataSource[],
	fqn: string
};

export type ReceiveDataSources = {
	type: typeof DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES,
	payload: ReceiveDataSourcesPayload
};

export type RecordDataSourcesError = {
	type: typeof DATA_SOURCES_EVENTS.RECORD_DATA_SOURCES_ERROR,
	payload: string
};

export type SetDataSources = {
	type: typeof DATA_SOURCES_EVENTS.SET_ROOT_DATA_SOURCES,
	payload: RawDataSource[]
};

type UnknownDataSourcesAction = {
	type: typeof DATA_SOURCES_EVENTS.UNKNOWN_DATA_SOURCES_ACTION,
	payload: null
};

export type DataSourcesAction =
	| SetDataSources
	| RecordDataSourcesError
	| ReceiveDataSources
	| UnknownDataSourcesAction
;

export type DataSourcesState = {
	map: DataSourceMap
};
