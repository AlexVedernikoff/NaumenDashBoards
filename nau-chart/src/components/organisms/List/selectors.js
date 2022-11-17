// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {goToPoint, showEditForm} from 'store/entity/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => ({
	activeElement: state.entity.activeElement,
	data: state.entity.data
});

export const functions: ConnectedFunctions = {
	goToPoint,
	showEditForm
};
