// @flow
import {defaultUsersAction, initialUsersState} from './init';
import type {UsersAction, UsersState} from './types';
import {USERS_EVENTS} from './constants';

const reducer = (state: UsersState = initialUsersState, action: UsersAction = defaultUsersAction): UsersState => {
	switch (action.type) {
		case USERS_EVENTS.REQUEST_USERS:
			return {
				...state,
				error: false,
				loading: true
			};
		case USERS_EVENTS.RECEIVE_USERS:
			return {
				...state,
				data: action.payload,
				loading: false,
				uploaded: true
			};
		case USERS_EVENTS.RECORD_USERS_ERROR:
			return {
				...state,
				error: true,
				loading: true
			};
		default:
			return state;
	}
};

export default reducer;
