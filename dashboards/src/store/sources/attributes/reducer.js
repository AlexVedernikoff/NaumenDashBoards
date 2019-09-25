// @flow
import type {AttributesAction, AttributesState} from './types';
import {ATTRIBUTES_EVENTS} from './constants';
import {defaultAttributesAction, initialAttributesState} from './init';

const reducer = (state: AttributesState = initialAttributesState, action: AttributesAction = defaultAttributesAction): AttributesState => {
	switch (action.type) {
		case ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES:
			state.map[action.payload.fqn] = action.payload.attributes;
			return {
				loading: false,
				...state
			};
		case ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR:
			return {
				error: true,
				loading: false,
				...state
			};
		case ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES:
			return {
				error: false,
				loading: true,
				...state
			};
		default:
			return state;
	}
};

export default reducer;
