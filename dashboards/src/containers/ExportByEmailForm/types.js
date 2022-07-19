// @flow
import type {FetchUsersAction, UsersState} from 'store/users/types';
import type {SendToEmailsAction} from 'store/dashboard/settings/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {|
	currentUser: UserData,
	sending: boolean,
	usersData: UsersState
|};

export type ConnectedFunctions = {|
	fetchUsers: FetchUsersAction,
	sendToEmails: SendToEmailsAction
|};

export type Props = {
	...ConnectedProps,
	...ConnectedFunctions,
	className: string
};
