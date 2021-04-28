// @flow
import type {CustomGroupsAction, CustomGroupsState} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';
import {defaultCustomGroupsAction, initialCustomGroupsState} from './init';

const reducer = (
	state: CustomGroupsState = initialCustomGroupsState,
	action: CustomGroupsAction = defaultCustomGroupsAction
): CustomGroupsState => {
	switch (action.type) {
		case CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_FULFILLED:
			return {
				...state,
				loading: false,
				map: action.payload
			};
		case CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_PENDING:
			return {
				...state,
				error: false,
				loading: true
			};
		case CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_REJECTED:
			return {
				...state,
				error: true,
				loading: false
			};
		case CUSTOM_GROUPS_EVENTS.REMOVE_CUSTOM_GROUP:
			delete state.map[action.payload];

			return {
				...state,
				map: {...state.map}
			};
		case CUSTOM_GROUPS_EVENTS.SAVE_CUSTOM_GROUP:
			return {
				...state,
				map: {
					...state.map,
					[action.payload.id]: action.payload
				}
			};
		default:
			return state;
	}
};

export default reducer;
