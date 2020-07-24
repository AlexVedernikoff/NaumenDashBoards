// @flow
import {defaultGroupsAction, initialGroupsState} from './init';
import type {DynamicGroup, DynamicGroupsAction, DynamicGroupsState, ReceiveDynamicAttributesPayload} from './types';
import {DYNAMIC_GROUPS_EVENTS} from './constants';

const setDynamicGroups = (state: DynamicGroupsState, groups: Array<DynamicGroup>) => {
	groups.forEach(group => {
		state[group.code] = {
			children: [],
			error: false,
			id: group.code,
			loading: false,
			parent: null,
			uploaded: false,
			value: group
		};
	});

	return {...state};
};

const setDynamicAttributes = (state: DynamicGroupsState, payload: ReceiveDynamicAttributesPayload) => {
	const {attributes, code} = payload;

	state[code] = {
		...state[code],
		children: attributes.map(attribute => attribute.code),
		loading: false,
		uploaded: true
	};

	attributes.forEach(attribute => {
		state[attribute.code] = {
			children: null,
			error: false,
			id: attribute.code,
			loading: false,
			parent: code,
			uploaded: true,
			value: attribute
		};
	});

	return {...state};
};

const reducer = (
	state: DynamicGroupsState = initialGroupsState,
	action: DynamicGroupsAction = defaultGroupsAction
): DynamicGroupsState => {
	switch (action.type) {
		case DYNAMIC_GROUPS_EVENTS.RECEIVE_DYNAMIC_ATTRIBUTES:
			return setDynamicAttributes(state, action.payload);
		case DYNAMIC_GROUPS_EVENTS.RECORD_DYNAMIC_ATTRIBUTES_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTES:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: false,
					loading: true
				}
			};
		case DYNAMIC_GROUPS_EVENTS.SET_DYNAMIC_GROUPS:
			return setDynamicGroups(state, action.payload);
		default:
			return state;
	}
};

export default reducer;
