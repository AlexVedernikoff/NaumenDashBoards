// @flow
import type {AttributesAction, AttributesState} from './types';
import {ATTRIBUTES_EVENTS} from './constants';
import {defaultAttributesAction, initialAttributesState} from './init';

const reducer = (state: AttributesState = initialAttributesState, action: AttributesAction = defaultAttributesAction): AttributesState => {
	switch (action.type) {
		case ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES:
			return {
				...state,
				[action.payload.classFqn]: {
					loading: false,
					options: action.payload.attributes,
					uploaded: true
				}
			};
		case ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR:
			return {
				...state,
				[action.payload]: {
					error: true,
					loading: false
				}
			};
		case ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES:
			return {
				...state,
				[action.payload]: {
					error: false,
					loading: true,
					options: [],
					uploaded: false
				}
			};
		default:
			return state;
	}
};

export default reducer;
