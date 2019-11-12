// @flow
import type {Location} from 'react-router';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	editable: boolean,
	master: boolean
};

export type ConnectedFunctions = {
	editDashboard: () => ThunkAction,
	fetchDashboard: () => ThunkAction,
	resetDashboard: () => ThunkAction,
	seeDashboard: () => ThunkAction,
	sendToMail: (file: Blob) => ThunkAction
};

export type Props = {
	location: Location
} & ConnectedProps & ConnectedFunctions;
