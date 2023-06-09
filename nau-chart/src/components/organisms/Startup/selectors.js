// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getDataEntity} from 'store/entity/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => {
	const {error, loading} = state.entity;

	return {
		error,
		loading
	};
};

export const functions: ConnectedFunctions = {
	getDataEntity
};
