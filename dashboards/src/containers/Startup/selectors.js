// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchDashboard} from 'store/dashboard/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	error: state.dashboard.error,
	loading: state.dashboard.loading
});

export const functions: ConnectedFunctions = {
	fetchDashboard
};
