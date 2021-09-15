// @flow
import type {AppState} from 'store/types';
import {
	changeLayoutMode,
	createPersonalDashboard,
	editDashboard,
	getSettings,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	switchDashboard
} from 'store/dashboard/settings/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {DASHBOARD_EDIT_MODE} from 'store/context/constants';
import {isEditableDashboardContext, isUserModeDashboard} from 'store/dashboard/settings/selectors';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard} = state;
	const {autoUpdate, editMode, layoutMode, personal, personalCreating, personalDeleting} = dashboard.settings;
	const {dashboardMode, switching, user} = context;
	const editableDashboard = dashboardMode === DASHBOARD_EDIT_MODE.EDIT;

	return {
		autoUpdateSettings: autoUpdate,
		editMode,
		editableDashboard,
		isEditableContext: isEditableDashboardContext(state),
		isUserMode: isUserModeDashboard(state),
		layoutMode,
		personalDashboard: personal,
		personalDashboardCreating: personalCreating,
		personalDashboardDeleting: personalDeleting,
		switching,
		user
	};
};

export const functions: ConnectedFunctions = {
	changeLayoutMode,
	createPersonalDashboard,
	editDashboard,
	getSettings,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	switchDashboard
};
