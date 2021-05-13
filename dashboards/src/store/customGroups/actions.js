// @flow
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
const fetchCustomGroup = (payload: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch({
		payload,
		type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_PENDING
	});

	try {
		const {code} = getState().dashboard.settings;
		const customGroup = await window.jsApi.restCallModule('dashboardSettings', 'getCustomGroup', code, payload);

		dispatch({
			payload: customGroup,
			type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_FULFILLED
		});
	} catch (e) {
		dispatch({
			payload,
			type: CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_REJECTED
		});
	}
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
		const customGroups = await window.jsApi.restCallModule('dashboardSettings', 'getCustomGroups', code);

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

const createCustomGroup = ({id: localId, ...customGroupData}: CustomGroup): ThunkAction =>
	async (dispatch: Dispatch): Promise<string | null> => {
	let id = null;

	try {
		const payload = {
			...getParams(),
			group: customGroupData
		};

		({id} = await window.jsApi.restCallModule('dashboardSettings', 'saveCustomGroup', payload));

		dispatch(removeCustomGroup(localId));
		dispatch(saveCustomGroup({...customGroupData, id}));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка создания группировки',
			type: 'error'
		}));
	}

	return id;
};

const deleteCustomGroup = (groupKey: string, remote: boolean = true): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		if (remote) {
			const payload = {
				...getParams(),
				groupKey
			};

			await window.jsApi.restCallModule('dashboardSettings', 'deleteCustomGroup', payload);
		}

		dispatch(removeCustomGroup(groupKey));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка удаления группировки',
			type: 'error'
		}));
	}
};

const updateCustomGroup = (group: CustomGroup, remote: boolean = false): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	let updatedGroup = group;

	try {
		if (remote) {
			const payload = {
				...getParams(),
				group
			};

			({group: updatedGroup} = await window.jsApi.restCallModule('dashboardSettings', 'updateCustomGroup', payload));
		}

		dispatch(saveCustomGroup(updatedGroup));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка сохранения группировки',
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

export {
	createCustomGroup,
	deleteCustomGroup,
	fetchCustomGroup,
	fetchCustomGroups,
	updateCustomGroup
};
