// @flow
import {createToast} from 'store/toasts/actions';
import type {CustomGroup, CustomGroupsMap, OnCreateCallback} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {getParams} from 'store/helpers';
import {LOCAL_PREFIX_ID} from 'components/molecules/GroupCreatingModal/constants';

const createCustomGroup = ({id: localId, ...customGroupData}: CustomGroup, callback: OnCreateCallback): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
	try {
		const payload = {
			...getParams(),
			group: customGroupData
		};
		const {id} = await window.jsApi.restCallModule('dashboardSettings', 'saveCustomGroup', payload);
		callback(id);

		dispatch(removeCustomGroup(localId));
		dispatch(saveCustomGroup({group: {...customGroupData, id}, remote: true}));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка создания группировки',
			type: 'error'
		}));
	}
};

const deleteCustomGroup = (groupKey: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		if (!groupKey.startsWith(LOCAL_PREFIX_ID)) {
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

const updateCustomGroup = (group: CustomGroup, remote: boolean = false, callback?: OnCreateCallback): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
	let updatedGroup = group;

	try {
		if (remote) {
			const payload = {
				...getParams(),
				group
			};
			({group: updatedGroup} = await window.jsApi.restCallModule('dashboardSettings', 'updateCustomGroup', payload));

			if (updatedGroup.id !== group.id) {
				callback && callback(updatedGroup.id);
			}
		}

		dispatch(saveCustomGroup({group: updatedGroup, remote}));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка сохранения группировки',
			type: 'error'
		}));
	}
};

const setCustomGroups = (payload: CustomGroupsMap) => (dispatch: Dispatch) => {
	Object.keys(payload).forEach(key => {
		if (!payload[key]) {
			delete payload[key];
		}
	});

	dispatch({
		payload,
		type: CUSTOM_GROUPS_EVENTS.SET_CUSTOM_GROUPS
	});
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
	setCustomGroups,
	updateCustomGroup
};
