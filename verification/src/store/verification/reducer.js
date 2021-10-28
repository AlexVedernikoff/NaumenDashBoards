// @flow

import {defaultVerificationAction, initialVerificationState} from './init';
import type {VerificationAction, VerificationState} from './types';
import {VERIFICATION_EVENTS} from './constants';

const reducer = (state: VerificationState = initialVerificationState, action: VerificationAction = defaultVerificationAction): VerificationState => {
	switch (action.type) {
		case VERIFICATION_EVENTS.SET_STEP_VERIFICATION:
			return {
				...state,
				index: action.payload
			};
		case VERIFICATION_EVENTS.SET_VERIFICATION_CODE:
			return {
				...state,
				code: action.payload
			};
		case VERIFICATION_EVENTS.SET_VERIFICATION_VALUE:
			return {
				...state,
				values: action.payload
			};
		case VERIFICATION_EVENTS.SET_VERIFICATION_RESULT:
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
};

export default reducer;
