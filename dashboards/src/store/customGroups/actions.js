// @flow
import {buildUrl, client} from 'utils/api';
import {createToast} from 'store/toasts/actions';
import type {CustomGroup, CustomGroupsMap} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getParams} from 'store/helpers';
import {LOCAL_PREFIX_ID} from 'components/molecules/GroupCreatingModal/constants';

const createCustomGroup = ({id: localId, ...customGroupData}: CustomGroup, callback: Function): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const {data: id} = await client.post(buildUrl('dashboardSettings', 'saveCustomGroup', 'requestContent,user'), {
			...getParams(getState()),
			group: customGroupData
		});
		callback(id);

		dispatch(removeCustomGroup(localId));
		dispatch(saveCustomGroup({...customGroupData, id}));
	} catch (e) {
		dispatch(createToast({
			text: 'Ошибка создания группировки',
			type: 'error'
		}));
	}
};

const deleteCustomGroup = (payload: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		if (!payload.startsWith(LOCAL_PREFIX_ID)) {
			await client.post(buildUrl('dashboardSettings', 'deleteCustomGroup', 'requestContent,user'), {
				...getParams(getState()),
				groupKey: payload
			});
		}

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

const saveCustomGroup = (payload: CustomGroup) => ({
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
