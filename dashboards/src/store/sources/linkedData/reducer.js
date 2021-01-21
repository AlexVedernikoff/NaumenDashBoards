// @flow
import {defaultDataSourcesAction, initialDataSourcesState} from './init';
import type {LinkedDataSourcesAction, LinkedDataSourcesState} from './types';
import {LINKED_DATA_SOURCES_EVENTS} from './constants';

const reducer = (state: LinkedDataSourcesState = initialDataSourcesState, action: LinkedDataSourcesAction = defaultDataSourcesAction): LinkedDataSourcesState => {
	switch (action.type) {
		case LINKED_DATA_SOURCES_EVENTS.REQUEST_LINKED_DATA_SOURCES:
			return {
				...state,
				[action.payload.id]: {
					error: false,
					loading: true,
					map: {
						[action.payload.id]: action.payload
					}
				}
			};
		case LINKED_DATA_SOURCES_EVENTS.RECEIVE_LINKED_DATA_SOURCES:
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					loading: true,
					map: {
						...action.payload.sources,
						[action.payload.id]: {
							...state[action.payload.id].map[action.payload.id],
							children: Object.keys(action.payload.sources)
						}
					}
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
