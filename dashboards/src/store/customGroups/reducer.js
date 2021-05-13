// @flow
import type {CustomGroup, CustomGroupsAction, CustomGroupsState} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';
import {defaultCustomGroupsAction, initialCustomGroupsState} from './init';

/**
 * Устанавливает пользовательские группировки
 * @param {CustomGroupsState} state - состояние пользовательских группировок
 * @param {Array<CustomGroup>} groups - массив пользовательских группировок
 * @returns {CustomGroupsState}
 */
const setCustomGroups = (state: CustomGroupsState, groups: Array<CustomGroup>): CustomGroupsState => {
	let newMap = state.map;

	groups.forEach(group => {
		if (!(group.id in newMap)) {
			const item = {
				data: group,
				loading: false
			};

			newMap = {...newMap, [group.id]: item};
		}
	});

	return {
		...state,
		loading: false,
		map: newMap
	};
};

const reducer = (
	state: CustomGroupsState = initialCustomGroupsState,
	action: CustomGroupsAction = defaultCustomGroupsAction
): CustomGroupsState => {
	switch (action.type) {
		case CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_FULFILLED:
			return {
				...state,
				map: {
					...state.map,
					[action.payload.id]: {
						data: action.payload,
						loading: false
					}
				}
			};
		case CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_PENDING:
			return {
				...state,
				map: {
					...state.map,
					[action.payload]: {
						data: null,
						loading: true
					}
				}
			};
		case CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_REJECTED:
			return {
				...state,
				map: {
					...state.map,
					[action.payload]: {
						...state.map[action.payload],
						loading: false
					}
				}
			};
		case CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_FULFILLED:
			return setCustomGroups(state, action.payload);
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
					[action.payload.id]: {
						...state.map[action.payload.id],
						data: action.payload
					}
				}
			};
		default:
			return state;
	}
};

export default reducer;
