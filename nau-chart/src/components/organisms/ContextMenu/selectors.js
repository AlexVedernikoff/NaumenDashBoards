// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	activeElement: state.entity.activeElement
});

export const functions: ConnectedFunctions = {};
