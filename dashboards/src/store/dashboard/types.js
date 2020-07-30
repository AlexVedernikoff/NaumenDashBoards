// @flow
import type {LayoutsState} from './layouts/types';
import type {SettingsState} from './settings/types';

export type DashboardState = {
	layouts: LayoutsState,
	settings: SettingsState
};
