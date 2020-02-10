// @flow
import {buildUrl, client} from 'utils/api';
import {createToast} from 'store/toasts/actions';
import type {CustomGroup, CustomGroupId, CustomGroupsMap} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getParams} from 'store/helpers';

const createCustomGroup = (payload: CustomGroup): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<string> => {
	let id = '';

	try {
		const {data} = await client.post(buildUrl('dashboardSettings', 'saveCustomGroup', 'requestContent,user'), {
			...getParams(getState()),
			group: payload
		});
		id = data;

		dispatch(removeCustomGroup(payload.id));
		dispatch(saveCustomGroup({...payload, id}));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка создания группировки',
			type: 'error'
		}));
	}

	return id;
};

const deleteCustomGroup = (payload: CustomGroupId): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		await client.post(buildUrl('dashboardSettings', 'deleteCustomGroup', 'requestContent,user'), {
			...getParams(getState()),
			groupKey: payload
		});

		dispatch(removeCustomGroup(payload));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка удаления группировки',
			type: 'error'
		}));
	}
};

const updateCustomGroup = (payload: CustomGroup, remote: boolean = false): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		if (remote) {
			await client.post(buildUrl('dashboardSettings', 'updateCustomGroup', 'requestContent,user'), {
				...getParams(getState()),
				group: payload,
				groupKey: payload.id
			});
		}

		dispatch(saveCustomGroup(payload));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка сохранения группировки',
			type: 'error'
		}));
	}
};

const saveCustomGroup = (payload: CustomGroup) => ({
	type: CUSTOM_GROUPS_EVENTS.SAVE_CUSTOM_GROUP,
	payload
});

const removeCustomGroup = (payload: CustomGroupId) => ({
	type: CUSTOM_GROUPS_EVENTS.REMOVE_CUSTOM_GROUP,
	payload
});

const setCustomGroups = (payload: CustomGroupsMap) => ({
	type: CUSTOM_GROUPS_EVENTS.SET_CUSTOM_GROUPS,
	payload
});

export {
	createCustomGroup,
	deleteCustomGroup,
	setCustomGroups,
	updateCustomGroup
};
