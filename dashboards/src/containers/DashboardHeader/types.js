// @flow
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	isEditable: boolean,
	name: string
};

export type ConnectedFunctions = {
	editDashboard: () => ThunkAction,
	fetchDashboard: () => ThunkAction,
	seeDashboard: () => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
