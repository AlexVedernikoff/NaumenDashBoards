// @flow
import {DASHBOARD_EVENTS, DEFAULT_INTERVAL} from './constants';
import {getLayoutMode} from 'helpers';
import isMobile from 'ismobilejs';
import type {SettingsAction, SettingsState} from './types';

const isMobileDevice = isMobile().any;

export const initialDashboardState: SettingsState = {
	autoUpdate: {
		defaultInterval: DEFAULT_INTERVAL,
		enabled: false,
		interval: DEFAULT_INTERVAL,
		remainder: DEFAULT_INTERVAL * 60
	},
	code: '',
	editMode: false,
	error: false,
	exportingFailToEmail: {
		error: false,
		loading: false
	},
	isMobileDevice,
	layoutMode: getLayoutMode(isMobileDevice),
	loading: false,
	personal: false,
	personalCreating: false,
	personalDeleting: false
};

export const defaultDashboardAction: SettingsAction = {
	payload: null,
	type: DASHBOARD_EVENTS.UNKNOWN_DASHBOARD_ACTION
};
