// @flow
import type {AddNewWidget, ValidateWidgetToCopyResult, WidgetMap} from 'store/widgets/data/types';
import type {DashboardsState} from 'store/dashboards/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {|
	dashboards: DashboardsState,
	isUserMode: boolean,
	layoutMode: LayoutMode,
	personalDashboard: boolean,
	user: UserData,
	widgets: WidgetMap
|};

export type ConnectedFunctions = {|
	addNewWidget: AddNewWidget,
	copyWidget: (dashboardId: string, widgetId: string, ignoreCustomGroups?: boolean) => ThunkAction,
	fetchDashboards: () => ThunkAction,
	validateWidgetToCopy: (dashboardId: string, widgetId: string) => ThunkAction
|};

export type Props = {
	...ConnectedFunctions,
	...ConnectedProps,
	validateWidgetToCopy: (dashboardId: string, widgetId: string) => Promise<ValidateWidgetToCopyResult>
};
