// @flow

import type {UserAction, UserState} from './types';
import {USER_EVENTS} from './constants';

export const initialUserState: UserState = {
	error: false,
	loading: false,
	user: {}
};

export const defaultUserAction: UserAction = {
	payload: null,
	type: USER_EVENTS.EMPTY_DATA
};
