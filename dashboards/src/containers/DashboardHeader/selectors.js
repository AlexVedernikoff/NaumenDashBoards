// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {
	createPersonalDashboard,
	editDashboard,
	getSettings,
	removePersonalDashboard,
	seeDashboard,
	sendToMail
} from 'store/dashboard/actions';
import {switchDashboard} from 'store/context/actions';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard} = state;
	const {autoUpdate, editable, editMode, personal, personalCreating, personalDeleting} = dashboard;
	const {switching, user} = context;

	return {
		autoUpdateEnabled: autoUpdate.enabled,
		editableDashboard: editable,
		editMode,
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
	seeDashboard,
	sendToMail,
	switchDashboard
};
