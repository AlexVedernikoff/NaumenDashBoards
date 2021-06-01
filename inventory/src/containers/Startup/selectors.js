// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getAppConfig} from 'store/geolocation/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	error: state.geolocation.error,
	loading: state.geolocation.loading,
	success: state.geolocation.success
});

export const functions: ConnectedFunctions = {
	getAppConfig
};
