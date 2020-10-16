// @flow
import {DASHBOARD_EVENTS, DEFAULT_INTERVAL} from './constants';
import {getLayoutMode} from 'src/helpers';
import {initPersonalProperty} from './helpers';
import type {SettingsAction, SettingsState} from './types';

export const initialDashboardState: SettingsState = {
	autoUpdate: {
		defaultInterval: DEFAULT_INTERVAL,
		enabled: false,
		interval: DEFAULT_INTERVAL,
		remainder: DEFAULT_INTERVAL * 60
	},
	editMode: false,
	editable: false,
	error: false,
	exportingFailToEmail: {
		error: false,
		loading: false
	},
	layoutMode: getLayoutMode(),
	loading: false,
	personal: initPersonalProperty(),
	personalCreating: false,
	personalDeleting: false
};

export const defaultDashboardAction: SettingsAction = {
	payload: null,
	type: DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION
};
