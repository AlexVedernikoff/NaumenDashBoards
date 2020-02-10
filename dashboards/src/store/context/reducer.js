// @flow
import type {ContextAction, ContextState} from './types';
import {CONTEXT_EVENTS} from './constants';
import {defaultContextAction, initialContextState} from './init';

const reducer = (state: ContextState = initialContextState, action: ContextAction = defaultContextAction): ContextState => {
	switch (action.type) {
		case CONTEXT_EVENTS.END_SWITCH:
			return {
				...state,
				switching: false
			};
		case CONTEXT_EVENTS.SET_CONTEXT:
			return {
				...state,
				...action.payload
			};
		case CONTEXT_EVENTS.SET_TEMP:
			return {
				...state,
				temp: action.payload
			};
		case CONTEXT_EVENTS.SET_USER_DATA:
			return {
				...state,
				user: {...state.user, ...action.payload}
			};
		case CONTEXT_EVENTS.START_SWITCH:
			return {
				...state,
				switching: true
			};
		default:
			return state;
	}
};

export default reducer;
