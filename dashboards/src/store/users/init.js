// @flow
import type {UsersAction, UsersState} from './types';
import {USERS_EVENTS} from './constants';

export const initialUsersState: UsersState = {
	data: [],
	error: false,
	loading: false,
	uploaded: false
};

export const defaultUsersAction: UsersAction = {
	payload: null,
	type: USERS_EVENTS.UNKNOWN_USERS_ACTION
};
