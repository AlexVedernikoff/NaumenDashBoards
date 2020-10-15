// @flow
import type {User} from 'store/users/types';

export type Format = {
	label: string,
	value: string
};

export type State = {
	format: Format,
	selectedUsers: Array<User>
};
