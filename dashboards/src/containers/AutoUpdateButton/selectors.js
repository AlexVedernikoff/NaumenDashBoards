// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getSettings, saveAutoUpdateSettings} from 'store/dashboard/settings/actions';

export const props = (state: AppState): ConnectedProps => ({
	personalDashboard: state.dashboard.settings.personal,
	role: state.context.user.role,
	settings: state.dashboard.settings.autoUpdate
});

export const functions: ConnectedFunctions = {
	getSettings,
	onSaveSettings: saveAutoUpdateSettings
};
