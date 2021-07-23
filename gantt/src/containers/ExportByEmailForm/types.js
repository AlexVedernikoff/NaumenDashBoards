// @flow
import type {FetchUsers, UsersState} from 'store/users/types';
import type {SendToEmails} from 'store/dashboard/settings/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {|
	currentUser: UserData,
	sending: boolean,
	usersData: UsersState
|};

export type ConnectedFunctions = {|
	fetchUsers: FetchUsers,
	sendToEmails: SendToEmails
|};

export type Props = {
	...ConnectedProps,
	...ConnectedFunctions,
	className: string
};
