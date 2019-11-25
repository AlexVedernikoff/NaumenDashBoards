// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editDashboard, fetchDashboard, resetDashboard, seeDashboard, sendToMail} from 'store/dashboard/actions';

export const props = (state: AppState): ConnectedProps => ({
	editable: state.dashboard.editable,
	role: state.dashboard.role
});

export const functions: ConnectedFunctions = {
	editDashboard,
	fetchDashboard,
	resetDashboard,
	seeDashboard,
	sendToMail
};
