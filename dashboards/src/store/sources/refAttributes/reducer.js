// @flow
import {defaultRefAttributesAction, initialRefAttributesState} from './init';
import type {RefAttributesAction, RefAttributesState} from './types';
import {REF_ATTRIBUTES_EVENTS} from './constants';

const reducer = (state: RefAttributesState = initialRefAttributesState, action: RefAttributesAction = defaultRefAttributesAction): RefAttributesState => {
	switch (action.type) {
		case REF_ATTRIBUTES_EVENTS.RECEIVE_REF_ATTRIBUTES:
			state[action.payload.refCode] = {
				...state[action.payload.refCode],
				loading: false,
				options: action.payload.refAttributes,
				uploaded: true
			};
			return {...state};
		case REF_ATTRIBUTES_EVENTS.RECORD_REF_ATTRIBUTES_ERROR:
			state[action.payload] = {
				...state[action.payload],
				error: true,
				loading: false
			};
			return {...state};
		case REF_ATTRIBUTES_EVENTS.REQUEST_REF_ATTRIBUTES:
			state[action.payload] = {
				error: false,
				loading: true,
				options: [],
				uploaded: false
			};
			return {...state};
		default:
			return state;
	}
};

export default reducer;
