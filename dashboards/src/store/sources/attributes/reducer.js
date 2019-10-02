// @flow
import type {AttributesAction, AttributesState} from './types';
import {ATTRIBUTES_EVENTS} from './constants';
import {defaultAttributesAction, initialAttributesState} from './init';

const reducer = (state: AttributesState = initialAttributesState, action: AttributesAction = defaultAttributesAction): AttributesState => {
	switch (action.type) {
		case ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES:
			state.map[action.payload.fqn] = action.payload.attributes;
			return {
				...state,
				loading: false,
				map: {...state.map}
			};
		case ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR:
			return {
				...state,
				error: true,
				loading: false
			};
		case ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES:
			return {
				...state,
				error: false,
				loading: true
			};
		default:
			return state;
	}
};

export default reducer;
