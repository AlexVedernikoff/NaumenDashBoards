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
	sendToMail
} from 'store/dashboard/settings/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {switchDashboard} from 'store/context/actions';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard} = state;
	const {autoUpdate, editMode, editable, layoutMode, personal, personalCreating, personalDeleting} = dashboard.settings;
	const {switching, user} = context;

	return {
		autoUpdateSettings: autoUpdate,
		editMode,
		editableDashboard: editable,
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
	sendToMail,
	switchDashboard
};
