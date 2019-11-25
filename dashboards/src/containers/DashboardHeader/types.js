// @flow
import type {Location} from 'react-router';
import type {Role} from 'store/dashboard/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	editable: boolean,
	role?: Role
};

export type ConnectedFunctions = {
	editDashboard: () => ThunkAction,
	fetchDashboard: () => ThunkAction,
	resetDashboard: () => ThunkAction,
	seeDashboard: () => ThunkAction,
	sendToMail: (name: string, type: string, file: Blob) => ThunkAction
};

export type Props = {
	location: Location
} & ConnectedProps & ConnectedFunctions;
