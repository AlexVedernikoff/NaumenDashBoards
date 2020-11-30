// @flow
import type {DashboardsState, FetchDashboards} from 'store/dashboards/types';
import type {NavigationSettings} from 'store/widgets/data/types';

export type Props = {
	dashboards: DashboardsState,
	fetchDashboards: FetchDashboards,
	onChange: (name: string, settings: NavigationSettings) => void,
	settings: NavigationSettings
};
