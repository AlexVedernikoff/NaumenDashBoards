// @flow
import type {CurrentObjectAction, CurrentObjectState} from './types';
import {CURRENT_OBJECT_EVENTS} from './constants';
import {defaultCurrentObjectAction, initialCurrentObjectState} from './init';
import {receiveNodes, receiveRoots, recordError, request} from './helpers';

const reducer = (state: CurrentObjectState = initialCurrentObjectState, action: CurrentObjectAction = defaultCurrentObjectAction): CurrentObjectState => {
	switch (action.type) {
		case CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_NODES:
			return receiveNodes(state, action.payload);
		case CURRENT_OBJECT_EVENTS.RECEIVE_CURRENT_OBJECT_ROOTS:
			return receiveRoots(state, action.payload);
		case CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_NODES_ERROR:
			return {
				...state,
				[action.payload.type]: {
					...state[action.payload.type],
					items: {
						...state[action.payload.type].items,
						[action.payload.parent]: recordError(state[action.payload.parent])
					}
				}
			};
		case CURRENT_OBJECT_EVENTS.RECORD_CURRENT_OBJECT_ROOTS_ERROR:
			return {
				...state,
				[action.payload]: recordError(state[action.payload])
			};
		case CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_NODES:
			return {
				...state,
				[action.payload.type]: {
					...state[action.payload.type],
					items: {
						...state[action.payload.type].items,
						[action.payload.parent]: request(state[action.payload.type].items[action.payload.parent])
					}
				}
			};
		case CURRENT_OBJECT_EVENTS.REQUEST_CURRENT_OBJECT_ROOTS:
			return {
				...state,
				[action.payload]: {
					error: false,
					items: {},
					loading: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
