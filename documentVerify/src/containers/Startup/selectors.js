// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getVerify} from 'store/verify/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => {
	const {error, loading} = state.verify;

	return {
		error,
		loading
	};
};

export const functions: ConnectedFunctions = {
	getVerify
};
