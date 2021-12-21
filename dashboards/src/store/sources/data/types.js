// @flow
import {DATA_SOURCES_EVENTS} from './constants';
import type {TreeNode} from 'components/types';

export type RawDataSource = {
	children: Array<RawDataSource>,
	classFqn: string,
	descriptor?: string,
	hasDynamic: boolean,
	sourceFilterAttributeGroup: string | null,
	title: string
};

type Source = {
	hasDynamic: boolean,
	label: string,
	value: string,
};

export type DataSource = TreeNode<Source>;

export type DataSourceMap = {
	[key: string]: DataSource
};

export type ReceiveDataSources = {
	payload: DataSourceMap,
	type: typeof DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES
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
