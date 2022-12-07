// @flow
import {defaultGroupsAction, initialGroupsState} from './init';
import type {
	DynamicGroupsAction,
	DynamicGroupsState,
	ReceiveDynamicAttributeGroupsPayload,
	ReceiveDynamicAttributesPayload,
	ReceiveDynamicAttributesSearchPayload
} from './types';
import {omit} from 'helpers';

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

const setDynamicAttributesSearch = (
	state: DynamicGroupsState,
	payload: ReceiveDynamicAttributesSearchPayload
): DynamicGroupsState => {
	const {dataKey, groups} = payload;
	const data = {};

	groups.forEach(({attributes, dynamicGroup}) => {
		const groupCode = dynamicGroup.code;
		const children = [];

		attributes.forEach(attribute => {
			data[attribute.code] = {
				children: null,
				error: false,
				id: attribute.code,
				loading: false,
				parent: groupCode,
				uploaded: true,
				value: attribute
			};
			children.push(attribute.code);
		});

		data[dynamicGroup.code] = {
			children,
			error: false,
			id: dynamicGroup.code,
			loading: false,
			parent: null,
			uploaded: true,
			value: dynamicGroup
		};
	});

	return {
		...state,
		[dataKey]: {
			data,
			error: false,
			loading: false
		}
	};
};

const reducer = (
	state: DynamicGroupsState = initialGroupsState,
	action: DynamicGroupsAction = defaultGroupsAction
): DynamicGroupsState => {
	switch (action.type) {
		case 'sources/dynamicAttributes/receiveDynamicAttributeGroups':
			return setDynamicGroups(state, action.payload);
		case 'sources/dynamicAttributes/receiveDynamicAttributes':
			return setDynamicAttributes(state, action.payload);
		case 'sources/dynamicAttributes/receiveDynamicAttributesSearch':
			return setDynamicAttributesSearch(state, action.payload);
		case 'sources/dynamicAttributes/recordDynamicAttributesError':
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
		case 'sources/dynamicAttributes/recordDynamicAttributeGroupsError':
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		case 'sources/dynamicAttributes/requestDynamicAttributeGroups':
			return {
				...state,
				[action.payload]: {
					data: {},
					error: false,
					loading: true
				}
			};
		case 'sources/dynamicAttributes/requestDynamicAttributes':
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: false,
					loading: true
				}
			};
		case 'sources/dynamicAttributes/clearDynamicAttributeGroups':
			return omit(state, action.payload);
		default:
			return state;
	}
};

export default reducer;
