// @flow
import type {Role} from 'store/dashboard/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	autoUpdateEnabled: boolean,
	editable: boolean,
	editMode: boolean,
	role?: Role
};

export type ConnectedFunctions = {
	editDashboard: () => ThunkAction,
	getSettings: () => ThunkAction,
	resetDashboard: () => ThunkAction,
	seeDashboard: () => ThunkAction,
	sendToMail: (name: string, type: string, file: Blob) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
