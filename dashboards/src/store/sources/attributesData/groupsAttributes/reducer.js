// @flow
import {defaultGroupsAttributesAction, initialGroupsAttributesState} from './init';
import type {GroupsAttributesAction, GroupsAttributesState} from './types';

const reducer = (state: GroupsAttributesState = initialGroupsAttributesState, action: GroupsAttributesAction = defaultGroupsAttributesAction): GroupsAttributesState => {
	switch (action.type) {
		case 'RECEIVE_GROUPS_ATTRIBUTES_ACTION':
			return {
				...state,
				[action.payload.key]: {
					error: false,
					item: action.payload.data,
					loading: false
				}
			};
		case 'REQUEST_GROUPS_ATTRIBUTES_ACTION_ERROR':
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case 'REQUEST_GROUPS_ATTRIBUTES_ACTION':
			return {
				...state,
				[action.payload]: {
					error: false,
					item: [],
					loading: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
