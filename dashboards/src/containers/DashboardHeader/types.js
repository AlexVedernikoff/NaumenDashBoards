// @flow
import type {AutoUpdateSettings, LayoutMode} from 'store/dashboard/settings/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {
	autoUpdateSettings: AutoUpdateSettings,
	editableDashboard: boolean,
	editMode: boolean,
	layoutMode: string,
	personalDashboard: boolean,
	personalDashboardCreating: boolean,
	personalDashboardDeleting: boolean,
	switching: boolean,
	user: UserData
};

export type ConnectedFunctions = {
	changeLayoutMode: (mode: LayoutMode) => ThunkAction,
	createPersonalDashboard: () => ThunkAction,
	editDashboard: () => ThunkAction,
	getSettings: (personal: boolean) => ThunkAction,
	removePersonalDashboard: () => ThunkAction,
	saveAutoUpdateSettings: (enabled: boolean, interval: string | number) => ThunkAction,
	seeDashboard: () => ThunkAction,
	switchDashboard: () => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions;
