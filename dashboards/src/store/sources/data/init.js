// @flow
import {DATA_SOURCES_EVENTS} from './constants';
import type {DataSourcesAction, DataSourcesState} from './types';

export const initialDataSourcesState: DataSourcesState = {
	error: false,
	loading: false,
	map: {}
};

export const defaultDataSourcesAction: DataSourcesAction = {
	type: DATA_SOURCES_EVENTS.UNKNOWN_DATA_SOURCES_ACTION,
	payload: null
};
