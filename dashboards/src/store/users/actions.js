// @flow
import api from 'api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {User} from './types';
import {USERS_EVENTS} from './constants';

const fetchUsers = (): ThunkAction => async (dispatch: Dispatch) => {
	dispatch(requestUsers());

	try {
		const data = await api.dashboardSettings.settings.getUsers();

		dispatch(receiveUsers(data));
	} catch (e) {
		dispatch(recordUsersError());
	}
};

const receiveUsers = (payload: User[]) => ({
	payload,
	type: USERS_EVENTS.RECEIVE_USERS
});

const recordUsersError = () => ({
	type: USERS_EVENTS.RECORD_USERS_ERROR
});

const requestUsers = () => ({
	type: USERS_EVENTS.REQUEST_USERS
});

export {
	fetchUsers
};
