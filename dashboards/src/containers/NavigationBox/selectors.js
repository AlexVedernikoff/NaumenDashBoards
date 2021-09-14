// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchDashboards} from 'src/store/dashboards/actions';
import {isEditableDashboardContext} from 'store/dashboard/settings/selectors';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {context} = state;

	return {
		dashboards: state.dashboards,
		isEditableContext: isEditableDashboardContext(state),
		user: context.user
	};
};

export const functions: ConnectedFunctions = {
	fetchDashboards
};
