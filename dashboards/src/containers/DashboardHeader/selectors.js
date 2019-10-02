// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editDashboard, fetchDashboard, seeDashboard} from 'store/dashboard/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	isEditable: state.dashboard.isEditable,
	name: state.dashboard.name,
	widgets: state.widgets.data.map
});

export const functions: ConnectedFunctions = {
	editDashboard,
	fetchDashboard,
	seeDashboard
};
