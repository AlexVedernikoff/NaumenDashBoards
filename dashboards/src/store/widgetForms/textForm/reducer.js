// @flow
import type {Action} from 'store/widgetForms/types';
import {EVENTS} from 'store/widgetForms/constants';
import {initialState} from './init';
import type {State} from './types';

const reducer = (state: State = initialState, action: Action): State => {
	switch (action.type) {
		case EVENTS.CHANGE_TEXT_FORM_VALUES:
			return action.payload;
		case EVENTS.RESET_FORM:
			return initialState;
		default:
			return state;
	}
};

export default reducer;
