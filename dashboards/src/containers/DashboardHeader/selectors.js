// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {
	createPersonalDashboard,
	editDashboard,
	getSettings,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	sendToMail
} from 'store/dashboard/actions';
import {switchDashboard} from 'store/context/actions';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard} = state;
	const {autoUpdate, editMode, editable, personal, personalCreating, personalDeleting} = dashboard;
	const {switching, user} = context;

	return {
		autoUpdateSettings: autoUpdate,
		editMode,
		editableDashboard: editable,
		personalDashboard: personal,
		personalDashboardCreating: personalCreating,
		personalDashboardDeleting: personalDeleting,
		switching,
		user
	};
};

export const functions: ConnectedFunctions = {
	createPersonalDashboard,
	editDashboard,
	getSettings,
	removePersonalDashboard,
	saveAutoUpdateSettings,
	seeDashboard,
	sendToMail,
	switchDashboard
};
