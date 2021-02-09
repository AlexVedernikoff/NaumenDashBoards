// @flow
import type {CustomGroupsAction, CustomGroupsState} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';
import {deepClone} from 'helpers';
import {defaultCustomGroupsAction, initialCustomGroupsState} from './init';

const reducer = (
	state: CustomGroupsState = initialCustomGroupsState,
	action: CustomGroupsAction = defaultCustomGroupsAction
): CustomGroupsState => {
	switch (action.type) {
		case CUSTOM_GROUPS_EVENTS.REMOVE_CUSTOM_GROUP:
			delete state.editable[action.payload];

			if (action.payload in state.original) {
				delete state.original[action.payload];
			}

			return deepClone(state);
		case CUSTOM_GROUPS_EVENTS.SAVE_CUSTOM_GROUP:
			if (action.payload.remote) {
				state.original = {
					...state.original,
					[action.payload.group.id]: action.payload.group
				};
			}

			return {
				...state,
				editable: {
					...state.editable,
					[action.payload.group.id]: action.payload.group
				}
			};
		case CUSTOM_GROUPS_EVENTS.SET_CUSTOM_GROUPS:
			return {
				editable: deepClone(action.payload),
				original: action.payload
			};
		default:
			return state;
	}
};

export default reducer;
