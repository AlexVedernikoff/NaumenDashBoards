// @flow
import {defaultVerifyAction, initialVerifyState} from './init';
import type {VerifyAction, VerifyState} from './types';
import {VERIFY_EVENTS} from './constants';

const reducer = (state: VerifyState = initialVerifyState, action: VerifyAction = defaultVerifyAction): VerifyState => {
	switch (action.type) {
		case VERIFY_EVENTS.SHOW_LOADER_DATA:
			return {
				...state,
				error: false,
				loading: true
			};
		case VERIFY_EVENTS.HIDE_LOADER_DATA:
			return {
				...state,
				loading: false
			};
		case VERIFY_EVENTS.SET_VERIFY_DATA:
			return {
				...state,
				data: action.payload
			};
		case VERIFY_EVENTS.SET_ERROR_DATA:
			return {
				...state,
				error: true
			};
		default:
			return state;
	}
};

export default reducer;
