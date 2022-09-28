// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {showEditForm} from 'store/entity/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	activeElement: state.entity.activeElement
});

export const functions: ConnectedFunctions = {
	showEditForm
};
