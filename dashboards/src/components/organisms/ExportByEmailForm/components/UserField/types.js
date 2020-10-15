// @flow
import type {FetchUsers, User, UsersState} from 'store/users/types';

export type Props = {
	fetchUsers: FetchUsers,
	index: number,
	onRemove: (index: number) => void,
	onSelect: (index: number, value: User) => void,
	removable: boolean,
	usersData: UsersState,
	value: User
};
