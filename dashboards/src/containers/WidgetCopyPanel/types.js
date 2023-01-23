// @flow
import type {DashboardsState} from 'store/dashboards/types';
import type {DivRef} from 'components/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';
import type {ValidateWidgetToCopyResult} from 'store/widgets/data/types';

export type ConnectedProps = {|
	dashboards: DashboardsState,
	isEditableContext: boolean,
	isUserMode: boolean,
	user: UserData,
|};

export type ConnectedFunctions = {|
	cancelForm: () => ThunkAction,
	copyWidget: (dashboardId: string, widgetId: string, relativeElement?: DivRef) => ThunkAction,
	fetchDashboards: () => ThunkAction,
	validateWidgetToCopy: (dashboardId: string, widgetId: string) => ThunkAction
|};

export type Props = {
	...ConnectedFunctions,
	...ConnectedProps,
	validateWidgetToCopy: (dashboardId: string, widgetId: string) => Promise<ValidateWidgetToCopyResult>
};
