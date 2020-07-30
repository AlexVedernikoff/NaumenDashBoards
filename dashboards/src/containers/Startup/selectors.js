// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchDashboard} from 'store/dashboard/settings/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {error, loading, personal} = state.dashboard.settings;

	return {
		error,
		loading,
		personal
	};
};

export const functions: ConnectedFunctions = {
	fetchDashboard
};
