// @flow
import {defaultGroupsAction, initialGroupsState} from './init';
import type {
	DynamicGroupsAction,
	DynamicGroupsState,
	ReceiveDynamicAttributeGroupsPayload,
	ReceiveDynamicAttributesPayload
} from './types';
import {DYNAMIC_GROUPS_EVENTS} from './constants';

const setDynamicGroups = (
	state: DynamicGroupsState,
	payload: ReceiveDynamicAttributeGroupsPayload
): DynamicGroupsState => {
	const {dataKey, groups} = payload;
	const data = {};

	groups.forEach(group => {
		data[group.code] = {
			children: [],
			error: false,
			id: group.code,
			loading: false,
			parent: null,
			uploaded: false,
			value: group
		};
	});

	const result = {
		...state,
		[dataKey]: {
			...state[dataKey],
			data: {...state[dataKey].data, ...data},
			loading: false
		}
	};

	return result;
};

const setDynamicAttributes = (
	state: DynamicGroupsState,
	payload: ReceiveDynamicAttributesPayload
): DynamicGroupsState => {
	const {attributes, dataKey, groupCode} = payload;

	const result = {
		...state,
		[dataKey]: {
			...state[dataKey],
			data: {
				...state[dataKey].data,
				[groupCode]: {
					...state[dataKey].data[groupCode],
					children: attributes.map(attribute => attribute.code),
					loading: false,
					uploaded: true
				}
			}
		}
	};

	attributes.forEach(attribute => {
		result[dataKey] = {
			...result[dataKey],
			data: {
				...result[dataKey].data,
				[attribute.code]: {
					children: null,
					error: false,
					id: attribute.code,
					loading: false,
					parent: groupCode,
					uploaded: true,
					value: attribute
				}
			}
		};
	});

	return result;
};

const reducer = (
	state: DynamicGroupsState = initialGroupsState,
	action: DynamicGroupsAction = defaultGroupsAction
): DynamicGroupsState => {
	switch (action.type) {
		case DYNAMIC_GROUPS_EVENTS.RECEIVE_DYNAMIC_ATTRIBUTE_GROUPS:
			return setDynamicGroups(state, action.payload);
		case DYNAMIC_GROUPS_EVENTS.RECEIVE_DYNAMIC_ATTRIBUTES:
			return setDynamicAttributes(state, action.payload);
		case DYNAMIC_GROUPS_EVENTS.RECORD_DYNAMIC_ATTRIBUTES_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					data: {
						...state[action.payload].data,
						error: true,
						loading: false
					}
				}
			};
		case DYNAMIC_GROUPS_EVENTS.RECORD_DYNAMIC_ATTRIBUTE_GROUPS_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case DYNAMIC_GROUPS_EVENTS.REQUEST_DYNAMIC_ATTRIBUTE_GROUPS:
			return {
				...state,
				[action.payload]: {
					data: {},
					error: false,
					loading: true
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
		case DYNAMIC_GROUPS_EVENTS.CLEAR_DYNAMIC_ATTRIBUTE_GROUPS:
			return {
				...state,
				[action.payload]: null
			};
		default:
			return state;
	}
};

export default reducer;
