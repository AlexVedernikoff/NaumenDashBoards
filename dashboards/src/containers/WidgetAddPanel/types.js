// @flow
import type {AddNewWidgetAction, ValidateWidgetToCopyResult, WidgetMap} from 'store/widgets/data/types';
import type {DashboardsState} from 'store/dashboards/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {|
	dashboards: DashboardsState,
	isEditableContext: boolean,
	isUserMode: boolean,
	layoutMode: LayoutMode,
	user: UserData,
	widgets: WidgetMap
|};

export type ConnectedFunctions = {|
	addNewWidget: AddNewWidgetAction,
	copyWidget: (dashboardId: string, widgetId: string, ignoreCustomGroups?: boolean) => ThunkAction,
	fetchDashboards: () => ThunkAction,
	validateWidgetToCopy: (dashboardId: string, widgetId: string) => ThunkAction
|};

export type Props = {
	...ConnectedFunctions,
	...ConnectedProps,
	validateWidgetToCopy: (dashboardId: string, widgetId: string) => Promise<ValidateWidgetToCopyResult>
};
