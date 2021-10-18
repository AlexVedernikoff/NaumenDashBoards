// @flow

import {defaultUserAction, initialUserState} from './init';
import type {UserAction, UserState} from './types';
import {USER_EVENTS} from './constants';

const reducer = (state: UserState = initialUserState, action: UserAction = defaultUserAction): UserState => {
	switch (action.type) {
		case USER_EVENTS.SHOW_LOADER_DATA:
			return {
				...state,
				error: false,
				loading: true
			};
		case USER_EVENTS.HIDE_LOADER_DATA:
			return {
				...state,
				loading: false
			};
		case USER_EVENTS.SET_USER_DATA:
			return {
				...state,
				user: action.payload
			};
		case USER_EVENTS.SET_ERROR_DATA:
			return {
				...state,
				error: true
			};
		default:
			return state;
	}
};

export default reducer;
