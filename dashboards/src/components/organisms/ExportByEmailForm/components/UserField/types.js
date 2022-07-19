// @flow
import type {FetchUsersAction, User, UsersState} from 'store/users/types';

export type Props = {
	fetchUsers: FetchUsersAction,
	index: number,
	onRemove: (index: number) => void,
	onSelect: (index: number, value: User) => void,
	removable: boolean,
	usersData: UsersState,
	value: User
};

export type State = {
	focusedSelectInput: boolean
};
