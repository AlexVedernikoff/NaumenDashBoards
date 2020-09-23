// @flow
import type {AppState} from 'store/types';
import {changeIntervalRemainder, saveAutoUpdateSettings} from 'store/dashboard/settings/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';

export const props = (state: AppState): ConnectedProps => ({
	personalDashboard: state.dashboard.settings.personal,
	role: state.context.user.role,
	settings: state.dashboard.settings.autoUpdate
});

export const functions: ConnectedFunctions = {
	onChangeRemainder: changeIntervalRemainder,
	onSaveSettings: saveAutoUpdateSettings
};
