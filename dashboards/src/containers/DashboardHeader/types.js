// @flow
import type {AutoUpdateSettings, DisplayMode} from 'store/dashboard/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {
	autoUpdateSettings: AutoUpdateSettings,
	editMode: boolean,
	editableDashboard: boolean,
	layoutMode: string,
	personalDashboard: boolean,
	personalDashboardCreating: boolean,
	personalDashboardDeleting: boolean,
	switching: boolean,
	user: UserData
};

export type ConnectedFunctions = {
	changeDisplayMode: (name: DisplayMode) => ThunkAction,
	createPersonalDashboard: () => ThunkAction,
	editDashboard: () => ThunkAction,
	getSettings: (personal: boolean) => ThunkAction,
	removePersonalDashboard: () => ThunkAction,
	saveAutoUpdateSettings: (enabled: boolean, interval: string | number) => ThunkAction,
	seeDashboard: () => ThunkAction,
	sendToMail: (name: string, type: string, file: Blob) => ThunkAction,
	switchDashboard: () => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
