// @flow
import {defaultDataSourcesAction, initialDataSourcesState} from './init';
import {getDataSourceMap} from 'store/sources/data/helpers';
import type {LinkedDataSourcesAction, LinkedDataSourcesState} from './types';
import {LINKED_DATA_SOURCES_EVENTS} from './constants';

const reducer = (state: LinkedDataSourcesState = initialDataSourcesState, action: LinkedDataSourcesAction = defaultDataSourcesAction): LinkedDataSourcesState => {
	switch (action.type) {
		case LINKED_DATA_SOURCES_EVENTS.REQUEST_LINKED_DATA_SOURCES:
			return {
				...state,
				[action.payload]: {
					error: false,
					loading: true,
					map: {}
				}
			};
		case LINKED_DATA_SOURCES_EVENTS.RECEIVE_LINKED_DATA_SOURCES:
			return {
				...state,
				[action.payload.classFqn]: {
					...state[action.payload.classFqn],
					loading: true,
					map: getDataSourceMap(action.payload.sources)
				}
			};
		case LINKED_DATA_SOURCES_EVENTS.RECORD_LINKED_DATA_SOURCES_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
