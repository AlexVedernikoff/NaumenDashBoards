// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editDashboard, fetchDashboard, resetDashboard, seeDashboard, sendToMail} from 'store/dashboard/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	editable: state.dashboard.editable,
	master: state.dashboard.master
});

export const functions: ConnectedFunctions = {
	editDashboard,
	fetchDashboard,
	resetDashboard,
	seeDashboard,
	sendToMail
};
