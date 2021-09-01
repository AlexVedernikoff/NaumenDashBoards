// @flow
import api from 'api';
import {ApiError} from 'api/errors';
import {createToast} from 'store/toasts/actions';
import type {CustomGroup} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getParams} from 'store/helpers';

/**
 * Получает данные группировки
 * @param {string} payload - идентификатор группировки
 * @returns {ThunkAction}
 */
const fetchCustomGroup = (payload: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<CustomGroup | null> => {
	dispatch({
		payload,
		type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_PENDING
	});

	try {
		const {code} = getState().dashboard.settings;
		const customGroup = await api.instance.dashboardSettings.customGroup.getItem(code, payload);

		dispatch({
			payload: customGroup,
			type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_FULFILLED
		});

		return customGroup;
	} catch (e) {
		dispatch({
			payload,
			type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_REJECTED
		});
	}

	return null;
};

/**
 * Получает информацию о кастомной группировке. В случае, если данные есть в store, то данные берутся из store, иначе, будут загружены с бэка
 * @param {string} payload - идентификатор группировки
 * @returns {ThunkAction}
 */
const getCustomGroup = (payload: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<CustomGroup | null> => {
	const state = getState();
	const {map} = state.customGroups;
	let result: CustomGroup | null = payload in map ? map[payload].data : null;

	if (!result) {
		result = await dispatch(fetchCustomGroup(payload)) ?? null;
	}

	return result;
};

/**
 * Получает список пользовательских группировок
 * @returns {ThunkAction}
 */
const fetchCustomGroups = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch({
		type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_PENDING
	});

	try {
		const {code} = getState().dashboard.settings;
		const customGroups = await api.instance.dashboardSettings.customGroup.getAll(code);

		dispatch({
			payload: customGroups,
			type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_FULFILLED
		});
	} catch (e) {
		dispatch({
			type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_REJECTED
		});
	}
};

const createCustomGroup = ({id: localId, ...customGroupData}: CustomGroup): ThunkAction => async (dispatch: Dispatch): Promise<string | null> => {
	let id = null;

	try {
		({id} = await api.instance.dashboardSettings.customGroup.save(getParams(), customGroupData));

		dispatch(removeCustomGroup(localId));
		dispatch(saveCustomGroup({...customGroupData, id}));
	} catch (e) {
		const errorMessage = e instanceof ApiError ? e.message : 'Ошибка создания группировки';

		dispatch(createToast({
			text: errorMessage,
			type: 'error'
		}));
	}

	return id;
};

const deleteCustomGroup = (groupKey: string, remote: boolean = true): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		if (remote) {
			await api.instance.dashboardSettings.customGroup.delete(getParams(), groupKey);
		}

		dispatch(removeCustomGroup(groupKey));
	} catch (e) {
		const errorMessage = e instanceof ApiError ? e.message : 'Ошибка удаления группировки';

		dispatch(createToast({
			text: errorMessage,
			type: 'error'
		}));
	}
};

const updateCustomGroup = (group: CustomGroup, remote: boolean = false): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	let updatedGroup = group;

	try {
		if (remote) {
			({group: updatedGroup} = await api.instance.dashboardSettings.customGroup.update(getParams(), group));
		}

		dispatch(saveCustomGroup(updatedGroup));
	} catch (e) {
		const errorMessage = e instanceof ApiError ? e.message : 'Ошибка сохранения группировки';

		dispatch(createToast({
			text: errorMessage,
			type: 'error'
		}));
	}
};

const saveCustomGroup = payload => ({
	payload,
	type: CUSTOM_GROUPS_EVENTS.SAVE_CUSTOM_GROUP
});

const removeCustomGroup = (payload: string) => ({
	payload,
	type: CUSTOM_GROUPS_EVENTS.REMOVE_CUSTOM_GROUP
});

const clearUnnamedCustomGroup = () => ({
	type: CUSTOM_GROUPS_EVENTS.REMOVE_UNNAMED_CUSTOM_GROUP
});

export {
	clearUnnamedCustomGroup,
	createCustomGroup,
	deleteCustomGroup,
	fetchCustomGroup,
	fetchCustomGroups,
	getCustomGroup,
	updateCustomGroup
};
