// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {isUserModeDashboard} from 'store/dashboard/settings/selectors';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	isUserMode: isUserModeDashboard(state)
});
