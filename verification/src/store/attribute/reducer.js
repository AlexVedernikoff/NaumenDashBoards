// @flow
import type {AttributeAction, AttributeState} from './types';
import {ATTRIBUTE_EVENTS} from './constants';
import {defaultAttributeAction, initialAttributeState} from './init';

const reducer = (state: AttributeState = initialAttributeState, action: AttributeAction = defaultAttributeAction): AttributeState => {
	switch (action.type) {
		case ATTRIBUTE_EVENTS.SET_ATTRIBUTE_DATE:
			return {
				...state,
				loadingData: false
			};
		default:
			return state;
	}
};

export default reducer;
