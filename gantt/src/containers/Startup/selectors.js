// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getAppConfig, getGanttData} from 'store/App/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {errorCommon} = state.APP;

	return {
		error: errorCommon
	};
};

export const functions: ConnectedFunctions = {
	getAppConfig,
	getGanttData
};
