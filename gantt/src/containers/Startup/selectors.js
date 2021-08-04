// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getAppConfig} from 'store/App/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {error, loading} = state.APP;

	return {
		error,
		loading
	};
};

export const functions: ConnectedFunctions = {
	getAppConfig
};
