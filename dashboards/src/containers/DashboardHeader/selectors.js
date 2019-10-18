// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editDashboard, fetchDashboard, seeDashboard, resetDashboard} from 'store/dashboard/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	editable: state.dashboard.editable,
	master: state.dashboard.master,
	name: state.dashboard.name
});

export const functions: ConnectedFunctions = {
	editDashboard,
	fetchDashboard,
	seeDashboard,
	resetDashboard
};
