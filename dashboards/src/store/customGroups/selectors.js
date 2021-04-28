// @flow
import type {AppState} from 'store/types';
import {createSelector} from 'reselect';
import type {CustomGroup, CustomGroupsMap} from './types';
import {getMapValues} from 'helpers';

/**
 * Возвращает данные состояния хранилища пользовательских группировок
 * @param {AppState} state - состояние хранилища
 * @returns {CustomGroupsMap}
 */
const getCustomGroups = (state: AppState): CustomGroupsMap => state.customGroups.map;

/**
 * Возвращает метанные всех пользовательских группировок
 */
const getCustomGroupsValues = createSelector(
	getCustomGroups,
	(map: CustomGroupsMap): Array<CustomGroup> => getMapValues(map)
);

export {
	getCustomGroups,
	getCustomGroupsValues
};
