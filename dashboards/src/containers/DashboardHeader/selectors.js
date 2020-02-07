// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editDashboard, getSettings, resetDashboard, seeDashboard, sendToMail} from 'store/dashboard/actions';

export const props = (state: AppState): ConnectedProps => {
	const {autoUpdate, editMode, editable, role} = state.dashboard;

	return {
		autoUpdateEnabled: autoUpdate.enabled,
		editable,
		editMode,
		role
	};
};

export const functions: ConnectedFunctions = {
	editDashboard,
	getSettings,
	resetDashboard,
	seeDashboard,
	sendToMail
};
