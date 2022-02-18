// @flow
import {defaultStatesAction, initialStatesState} from './init';
import type {StatesAction, StatesState} from './types';

const reducer = (state: StatesState = initialStatesState, action: StatesAction = defaultStatesAction): StatesState => {
	switch (action.type) {
		case 'RECEIVE_META_CLASS_STATES':
			return {
				...state,
				[action.payload.metaClassFqn]: {
					...state[action.payload.metaClassFqn],
					items: action.payload.data,
					loading: false
				}
			};
		case 'RECORD_META_CLASS_STATES_ERROR':
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case 'REQUEST_META_CLASS_STATES':
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
