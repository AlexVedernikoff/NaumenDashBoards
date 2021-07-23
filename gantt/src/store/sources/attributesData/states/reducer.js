// @flow
import {defaultStatesAction, initialStatesState} from './init';
import type {StatesAction, StatesState} from './types';
import {STATES_EVENTS} from './constants';

const reducer = (state: StatesState = initialStatesState, action: StatesAction = defaultStatesAction): StatesState => {
	switch (action.type) {
		case STATES_EVENTS.RECEIVE_META_CLASS_STATES:
			return {
				...state,
				[action.payload.metaClassFqn]: {
					...state[action.payload.metaClassFqn],
					items: action.payload.data,
					loading: false
				}
			};
		case STATES_EVENTS.RECORD_META_CLASS_STATES_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case STATES_EVENTS.REQUEST_META_CLASS_STATES:
			return {
				...state,
				[action.payload]: {
					error: false,
					items: [],
					loading: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
