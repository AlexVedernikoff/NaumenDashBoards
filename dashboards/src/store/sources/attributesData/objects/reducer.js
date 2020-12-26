// @flow
import {createObjectData, receiveObjectData, recordObjectError, requestObjectData} from './helpers';
import {defaultObjectsAction, initialObjectsState} from './init';
import type {ObjectsAction, ObjectsState} from './types';
import {OBJECTS_EVENTS} from './constants';

const reducer = (state: ObjectsState = initialObjectsState, action: ObjectsAction = defaultObjectsAction): ObjectsState => {
	switch (action.type) {
		case OBJECTS_EVENTS.FOUND_OBJECTS_FULFILLED:
			return {
				...state,
				found: {
					...state.found,
					[action.payload.id]: {
						...state.found[action.payload.id],
						items: action.payload.items,
						loading: false,
						uploaded: true
					}
				}
			};
		case OBJECTS_EVENTS.FOUND_OBJECTS_PENDING:
			return {
				...state,
				found: {
					...state.found,
					[action.payload.id]: {
						...createObjectData(),
						searchValue: action.payload.searchValue
					}
				}
			};
		case OBJECTS_EVENTS.FOUND_OBJECT_REJECTED:
			return {
				...state,
				...state,
				found: {
					...state.found,
					[action.payload]: {
						...state.found[action.payload],
						error: true,
						loading: false
					}
				}
			};
		case OBJECTS_EVENTS.RECEIVE_ACTUAL_OBJECT_DATA:
			return {
				...state,
				actual: {
					...state.actual,
					[action.payload.id]: receiveObjectData(state.actual, action.payload)
				}
			};
		case OBJECTS_EVENTS.RECEIVE_ALL_OBJECT_DATA:
			return {
				...state,
				all: {
					...state.all,
					[action.payload.id]: receiveObjectData(state.all, action.payload)
				}
			};
		case OBJECTS_EVENTS.RECORD_ACTUAL_OBJECT_DATA_ERROR:
			return {
				...state,
				actual: {
					...state.actual,
					[action.payload.id]: recordObjectError(state.actual, action.payload)
				}
			};
		case OBJECTS_EVENTS.RECORD_ALL_OBJECT_DATA_ERROR:
			return {
				...state,
				all: {
					...state.all,
					[action.payload.id]: recordObjectError(state.all, action.payload)
				}
			};
		case OBJECTS_EVENTS.REQUEST_ACTUAL_OBJECT_DATA:
			return {
				...state,
				actual: {
					...state.actual,
					[action.payload.id]: requestObjectData(state.actual, action.payload)
				}
		};
		case OBJECTS_EVENTS.REQUEST_ALL_OBJECT_DATA:
			return {
				...state,
				all: {
					...state.all,
					[action.payload.id]: requestObjectData(state.all, action.payload)
				}
			};
		default:
			return state;
	}
};

export default reducer;
