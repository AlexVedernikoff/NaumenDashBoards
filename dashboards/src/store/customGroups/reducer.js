// @flow
import type {CustomGroupsAction, CustomGroupsState} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';
import {defaultCustomGroupsAction, initialCustomGroupsState} from './init';

const reducer = (
	state: CustomGroupsState = initialCustomGroupsState,
	action: CustomGroupsAction = defaultCustomGroupsAction
): CustomGroupsState => {
	switch (action.type) {
		case CUSTOM_GROUPS_EVENTS.REMOVE_CUSTOM_GROUP:
			if (action.payload in state) {
				delete state[action.payload];
			}
			return {...state};
		case CUSTOM_GROUPS_EVENTS.SAVE_CUSTOM_GROUP:
			return {
				...state,
				[action.payload.id]: action.payload
			};
		case CUSTOM_GROUPS_EVENTS.SET_CUSTOM_GROUPS:
			return action.payload;
		default:
			return state;
	}
};

export default reducer;
