// @flow
import type {Action, State} from './types';
import {defaultAction, initialState} from './init';
import {EVENTS} from './constants';
import {getMap, initItem} from './heplers';

const reducer = (state: State = initialState, action: Action = defaultAction): State => {
	switch (action.type) {
		case EVENTS.REMOVE_FULFILLED:
			return {
				...state,
				[action.payload]: undefined
			};
		case EVENTS.REMOVE_PENDING:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					removing: {
						...state[action.payload].removing,
						error: false,
						loading: true
					}
				}
			};
		case EVENTS.REMOVE_REJECTED:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					removing: {
						...state[action.payload].removing,
						error: true,
						loading: false
					}
				}
			};
		case EVENTS.SAVE_FULFILLED:
			return {
				...state,
				[action.payload.key]: {
					...state[action.payload.key],
					data: action.payload,
					saving: {
						...state[action.payload.key].saving,
						loading: false
					}
				}
			};
		case EVENTS.SAVE_PENDING:
			return {
				...state,
				[action.payload]: initItem()
			};
		case EVENTS.SAVE_REJECTED:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					saving: {
						...state[action.payload].saving,
						error: true,
						loading: false
					}
				}
			};
		case EVENTS.SET:
			return getMap(action.payload);
		default:
			return state;
	}
};

export default reducer;
