// @flow
import type {AutoUpdateSettings, LayoutMode} from 'store/dashboard/settings/types';
import type {CommonDialogContextProps} from 'containers/CommonDialogs/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {
	autoUpdateSettings: AutoUpdateSettings,
	editableDashboard: boolean,
	editMode: boolean,
	isEditableContext: boolean,
	isUserMode: boolean,
	layoutMode: string,
	personalDashboard: boolean,
	personalDashboardCreating: boolean,
	personalDashboardDeleting: boolean,
	showHeader: boolean,
	switching: boolean,
	user: UserData
};

export type ConnectedFunctions = {
	changeLayoutMode: (mode: LayoutMode) => ThunkAction,
	changeShowHeader: (show: boolean) => ThunkAction,
	createPersonalDashboard: () => ThunkAction,
	editDashboard: () => ThunkAction,
	getSettings: (refresh: boolean) => ThunkAction,
	removePersonalDashboard: () => ThunkAction,
	saveAutoUpdateSettings: (enabled: boolean, interval: string | number) => ThunkAction,
	seeDashboard: () => ThunkAction,
	switchDashboard: () => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions & CommonDialogContextProps;
