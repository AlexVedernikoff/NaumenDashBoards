// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	widgets: state.widgets.data.map
});
