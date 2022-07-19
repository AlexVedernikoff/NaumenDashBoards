// @flow
import type {ThunkAction} from 'store/types';
import {USERS_EVENTS} from './constants';

export type FetchUsersAction = () => ThunkAction;

export type User = {
	email: string,
	name?: string
};

export type ReceiveUsers = {
	payload: User[],
	type: typeof USERS_EVENTS.RECEIVE_USERS
};

type RecordUsersError = {
	type: typeof USERS_EVENTS.RECORD_USERS_ERROR
};

type RequestUsers = {
	type: typeof USERS_EVENTS.REQUEST_USERS
};

type UnknownUsersAction = {
	type: typeof USERS_EVENTS.UNKNOWN_USERS_ACTION
};

export type UsersAction =
	| ReceiveUsers
	| RecordUsersError
	| RequestUsers
	| UnknownUsersAction
;

export type UsersState = {
	data: Array<User>,
	error: boolean,
	loading: boolean,
	uploaded: boolean
};
