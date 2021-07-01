// @flow
import {defaultSignatureAction, initialSignatureState} from './init';
import {SIGNATURE_EVENTS, SIGNATURE_STATE} from './constants';
import type {SignatureAction, SignatureState} from './types';

const reducer = (state: SignatureState = initialSignatureState, action: SignatureAction = defaultSignatureAction): SignatureState => {
	switch (action.type) {
		case SIGNATURE_EVENTS.ADD_SIGNATURE:
			return {
				...state,
				data: action.payload
			};
		case SIGNATURE_EVENTS.HIDE_LOADER:
			return {
				...state,
				loading: false
			};
		case SIGNATURE_EVENTS.SHOW_LOADER:
			return {
				...state,
				error: '',
				loading: true
			};
		case SIGNATURE_EVENTS.SET_CONTEXT:
			return {
				...state,
				subjectUuid: action.payload,
				loading: true
			};
		case SIGNATURE_EVENTS.SET_ERROR:
			return {
				...state,
				error: action.payload,
				loading: false,
				state: SIGNATURE_STATE.ERROR_STATE
			};
		case SIGNATURE_EVENTS.SET_PARAMS:
			return {
				...state,
				params: action.payload,
				loading: true
			};
		case SIGNATURE_EVENTS.SET_STATE:
			return {
				...state,
				state: action.payload
			};
		default:
			return state;
	}
};

export default reducer;
