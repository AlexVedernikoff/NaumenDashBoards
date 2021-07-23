// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard} = state;

	return {
		personalDashboard: dashboard.settings.personal,
		user: context.user
	};
};
