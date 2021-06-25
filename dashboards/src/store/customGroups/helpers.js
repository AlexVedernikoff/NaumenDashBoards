// @flow
import type {CustomGroup, CustomGroupsState} from './types';

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

/**
 * Очищаем неиспользуемые пользовательские группировки
 * @param {CustomGroupsState} state - состояние пользовательских группировок
 * @returns {CustomGroupsState}
 */
const removeUnnamedCustomGroup = (state: CustomGroupsState): CustomGroupsState => {
    const {map} = state;
    const newMap: typeof map = {};
    const keys = Object.keys(map);

    keys.forEach((key) => {
        const value = map[key];

        if (!key.startsWith('local_') || !!value.data.name) {
            newMap[key] = value;
        }
    });

	return {...state, map: newMap};
};

export {
    removeUnnamedCustomGroup,
    setCustomGroups
};
