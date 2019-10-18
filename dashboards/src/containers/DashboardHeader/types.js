// @flow
import type {Location} from 'react-router';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	editable: boolean,
	master: boolean,
	name: string
};

export type ConnectedFunctions = {
	editDashboard: () => ThunkAction,
	fetchDashboard: () => ThunkAction,
	resetDashboard: () => ThunkAction,
	seeDashboard: () => ThunkAction
};

export type Props = {
	location: Location
} & ConnectedProps & ConnectedFunctions;
