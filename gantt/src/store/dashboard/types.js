// @flow
import type {LayoutsState} from './layouts/types';
import type {SettingsState} from './settings/types';
import type {State as CustomChartColorsSettingsState} from './customChartColorsSettings/types';

export type DashboardState = {
	customChartColorsSettings: CustomChartColorsSettingsState,
	layouts: LayoutsState,
	settings: SettingsState
};
