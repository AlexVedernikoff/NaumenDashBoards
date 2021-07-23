// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchUsers} from 'store/users/actions';
import {sendToEmails} from 'store/dashboard/settings/actions';

export const props = (state: AppState): ConnectedProps => ({
	currentUser: state.context.user,
	sending: state.dashboard.settings.exportingFailToEmail.loading,
	usersData: state.users
});

export const functions: ConnectedFunctions = {
	fetchUsers,
	sendToEmails
};
