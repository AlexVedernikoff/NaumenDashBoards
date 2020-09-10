// @flow
import type {DataSourcesAction, DataSourcesState} from './types';
import {DATA_SOURCES_EVENTS} from './constants';
import {defaultDataSourcesAction, initialDataSourcesState} from './init';
import {getDataSourceMap} from './helpers';

const reducer = (state: DataSourcesState = initialDataSourcesState, action: DataSourcesAction = defaultDataSourcesAction): DataSourcesState => {
	switch (action.type) {
		case DATA_SOURCES_EVENTS.REQUEST_DATA_SOURCES:
			return {
				...state,
				error: false,
				loading: true
			};
		case DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES:
			return {
				...state,
				loading: false,
				map: getDataSourceMap(action.payload)
			};
		case DATA_SOURCES_EVENTS.RECORD_DATA_SOURCES_ERROR:
			return {
				...state,
				error: true,
				loading: true
			};
		default:
			return state;
	}
};

export default reducer;
