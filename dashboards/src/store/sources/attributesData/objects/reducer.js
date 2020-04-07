// @flow
import {defaultObjectsAction, initialObjectsState} from './init';
import type {ObjectsAction, ObjectsState} from './types';
import {OBJECTS_EVENTS} from './constants';
import {receiveObjectData, recordObjectError, requestObjectData} from './helpers';

const reducer = (state: ObjectsState = initialObjectsState, action: ObjectsAction = defaultObjectsAction): ObjectsState => {
	switch (action.type) {
		case OBJECTS_EVENTS.RECEIVE_ACTUAL_OBJECT_DATA:
			return {
				...state,
				actual: {
					...state.actual,
					[action.payload.property]: receiveObjectData(state.actual, action.payload)
				}
			};
		case OBJECTS_EVENTS.RECEIVE_ALL_OBJECT_DATA:
			return {
				...state,
				all: {
					...state.all,
					[action.payload.property]: receiveObjectData(state.all, action.payload)
				}
			};
		case OBJECTS_EVENTS.RECORD_ACTUAL_OBJECT_DATA_ERROR:
			return {
				...state,
				actual: {
					...state.actual,
					[action.payload.property]: recordObjectError(state.actual, action.payload)
				}
			};
		case OBJECTS_EVENTS.RECORD_ALL_OBJECT_DATA_ERROR:
			return {
				...state,
				all: {
					...state.all,
					[action.payload.property]: recordObjectError(state.all, action.payload)
				}
			};
		case OBJECTS_EVENTS.REQUEST_ACTUAL_OBJECT_DATA:
			return {
				...state,
				actual: {
					...state.actual,
					[action.payload.property]: requestObjectData(state.actual, action.payload)
				}
		};
		case OBJECTS_EVENTS.REQUEST_ALL_OBJECT_DATA:
			return {
				...state,
				all: {
					...state.all,
					[action.payload.property]: requestObjectData(state.all, action.payload)
				}
			};
		default:
			return state;
	}
};

export default reducer;
