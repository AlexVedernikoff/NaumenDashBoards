// @flow
import {defaultToastsAction, initialToastsState} from './init';
import type {ToastsAction, ToastsState} from './types';
import {TOASTS_EVENTS} from './constants';

const reducer = (state: ToastsState = initialToastsState, action: ToastsAction = defaultToastsAction): ToastsState => {
	switch (action.type) {
		case TOASTS_EVENTS.ADD_TOAST:
			state[action.payload.id] = action.payload;
			return {
				...state
			};
		case TOASTS_EVENTS.REMOVE_TOAST:
			delete state[action.payload];
			return {
				...state
			};
		default:
			return state;
	}
};

export default reducer;
