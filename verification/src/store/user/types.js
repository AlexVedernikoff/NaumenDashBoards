// @flow

import {USER_EVENTS} from './constants';

export type UserData = {
	admin: boolean,
	licensed: boolean,
	login: string,
	roles: Array<string>,
	title: string,
	uuid: string
};

export type UserAction = {
	payload: null,
	type: typeof USER_EVENTS.EMPTY_DATA,
};

export type UserState = {
	error: boolean,
	loading: boolean,
	user: UserData,
};
