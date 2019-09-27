// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	attributes: state.sources.attributes.map,
	dataSources: state.sources.data.map
});
