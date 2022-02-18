// @flow
import {createObjectData, receiveObjectData, recordObjectError, requestObjectData} from './helpers';
import {defaultObjectsAction, initialObjectsState} from './init';
import type {ObjectsAction, ObjectsState} from './types';
import {omit} from 'helpers';

const reducer = (state: ObjectsState = initialObjectsState, action: ObjectsAction = defaultObjectsAction): ObjectsState => {
	switch (action.type) {
		case 'CHANGE_SEARCH_VALUE':
			return {
				...state,
				found: {
					...state.found,
					[action.payload.id]: {
						...state.found[action.payload.id],
						searchValue: action.payload.searchValue
					}
				}
			};
		case 'FOUND_OBJECTS_FULFILLED':
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
		case 'FOUND_OBJECTS_PENDING':
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
		case 'FOUND_OBJECT_REJECTED':
			return {
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
		case 'OBJECT_DATA_FULFILLED':
			return {
				...state,
				[action.payload.type]: {
					...state[action.payload.type],
					[action.payload.id]: receiveObjectData(state[action.payload.type], action.payload)
				}
			};
		case 'OBJECT_DATA_PENDING':
			return {
				...state,
				[action.payload.type]: {
					...state[action.payload.type],
					[action.payload.id]: requestObjectData(state[action.payload.type], action.payload)
				}
			};
		case 'OBJECT_DATA_REJECTED':
			return {
				...state,
				[action.payload.type]: {
					...state[action.payload.type],
					[action.payload.id]: recordObjectError(state[action.payload.type], action.payload)
				}
			};
		case 'FOUND_OBJECTS_CLEAR_SEARCH':
			return {
				...state,
				found: omit(state.found, action.payload)
			};
		default:
			return state;
	}
};

export default reducer;
