// @flow
import type {DataSourcesAction, DataSourcesState} from './types';
import {DATA_SOURCES_EVENTS} from './constants';
import {defaultDataSourcesAction, initialDataSourcesState} from './init';
import {setChildrenDataSources, setDataSourceError, setRootDataSources} from './helpers';

const reducer = (state: DataSourcesState = initialDataSourcesState, action: DataSourcesAction = defaultDataSourcesAction): DataSourcesState => {
	switch (action.type) {
		case DATA_SOURCES_EVENTS.SET_ROOT_DATA_SOURCES:
			return setRootDataSources(state, action);
		case DATA_SOURCES_EVENTS.RECEIVE_DATA_SOURCES:
			return setChildrenDataSources(state, action);
		case DATA_SOURCES_EVENTS.RECORD_DATA_SOURCES_ERROR:
			return setDataSourceError(state, action);
		default:
			return state;
	}
};

export default reducer;
