// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveAutoUpdateSettings} from 'store/dashboard/actions';

export const props = (state: AppState): ConnectedProps => {
	const {defaultInterval, enabled, interval} = state.dashboard.autoUpdate;

	return {
		defaultInterval,
		enabled,
		interval
	};
};

export const functions: ConnectedFunctions = {
	saveAutoUpdateSettings
};
