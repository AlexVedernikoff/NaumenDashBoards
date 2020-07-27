// @flow
import type {AppState} from 'store/types';
import {
	changeDisplayMode,
	createPersonalDashboard,
	editDashboard,
	getSettings,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	sendToMail
} from 'store/dashboard/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {switchDashboard} from 'store/context/actions';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard} = state;
	const {autoUpdate, editMode, editable, layoutMode, personal, personalCreating, personalDeleting} = dashboard;
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
	changeDisplayMode,
	createPersonalDashboard,
	editDashboard,
	getSettings,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	sendToMail,
	switchDashboard
};
