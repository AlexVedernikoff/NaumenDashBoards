// @flow
import type {FetchUsersAction, User, UsersState} from 'store/users/types';

export type Props = {
	fetchUsers: FetchUsersAction,
	onRemove: (index: number) => void,
	onSelect: (index: number, value: User) => void,
	selectedUsers: Array<User>,
	usersData: UsersState
};
