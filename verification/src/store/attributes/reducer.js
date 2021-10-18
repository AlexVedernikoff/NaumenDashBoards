// @flow

import {ATTRIBUTE_EVENTS} from './constants';
import type {AttributesAction, AttributesState} from './types';
import {defaultAttributesAction, initialAttributesState} from './init';

const reducer = (state: AttributesState = initialAttributesState, action: AttributesAction = defaultAttributesAction): AttributesState => {
	switch (action.type) {
		case ATTRIBUTE_EVENTS.SHOW_LOADER_DATA:
			return {
				...state,
				error: false,
				loading: true
			};
		case ATTRIBUTE_EVENTS.HIDE_LOADER_DATA:
			return {
				...state,
				loading: false
			};
		case ATTRIBUTE_EVENTS.SET_ATTRIBUTE_DATA:
			return {
				...state,
				attributes: action.payload
			};
		case ATTRIBUTE_EVENTS.SET_ERROR_DATA:
			return {
				...state,
				error: true
			};
		default:
			return state;
	}
};

export default reducer;
