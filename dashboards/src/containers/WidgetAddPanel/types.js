// @flow
import type {DashboardsState} from 'store/dashboards/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type NewWidget from 'store/widgets/data/NewWidget';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';
import type {ValidateWidgetToCopyResult, WidgetMap} from 'store/widgets/data/types';

export type ConnectedProps = {|
	dashboards: DashboardsState,
	layoutMode: LayoutMode,
	personalDashboard: boolean,
	user: UserData,
	widgets: WidgetMap
|};

export type ConnectedFunctions = {|
	addWidget: (widget: NewWidget) => ThunkAction,
	copyWidget: (dashboardId: string, widgetId: string, ignoreCustomGroups?: boolean) => ThunkAction,
	fetchDashboards: () => ThunkAction,
	validateWidgetToCopy: (dashboardId: string, widgetId: string) => ThunkAction
|};

export type DispatchedConnectedFunctions = {|
	addWidget: (widget: NewWidget) => void,
	copyWidget: (dashboardId: string, widgetId: string, ignoreCustomGroups?: boolean) => Promise<void>,
	fetchDashboards: () => void,
	validateWidgetToCopy: (dashboardId: string, widgetId: string) => Promise<ValidateWidgetToCopyResult>
|};

export type Props = {
	...DispatchedConnectedFunctions,
	...ConnectedProps
};
