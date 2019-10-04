// @flow
import type {AttributesAction, AttributesState} from './types';
import {ATTRIBUTES_EVENTS} from './constants';
import {defaultAttributesAction, initialAttributesState} from './init';

const reducer = (state: AttributesState = initialAttributesState, action: AttributesAction = defaultAttributesAction): AttributesState => {
	switch (action.type) {
		case ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES:
			state.map[action.payload.classFqn].data = action.payload.attributes;
			state.map[action.payload.classFqn].loading = false;
			return {
				...state,
				map: {...state.map}
			};
		case ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR:
			state.map[action.payload].error = true;
			state.map[action.payload].loading = false;
			return {
				...state,
				map: {...state.map}
			};
		case ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES:
			state.map[action.payload] = {
				data: [],
				error: false,
				loading: true
			};
			return {
				...state,
				map: {...state.map}
			};
		default:
			return state;
	}
};

export default reducer;
