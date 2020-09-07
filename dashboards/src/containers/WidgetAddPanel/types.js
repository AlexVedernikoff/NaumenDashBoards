// @flow
import type {DashboardsState} from 'store/dashboards/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type NewWidget from 'store/widgets/data/NewWidget';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';
import type {WidgetMap} from 'store/widgets/data/types';

export type ConnectedProps = {|
	dashboards: DashboardsState,
	layoutMode: LayoutMode,
	user: UserData,
	widgets: WidgetMap
|};

export type ConnectedFunctions = {|
	addWidget: (widget: NewWidget) => ThunkAction,
	copyWidget: (widgetId: string) => ThunkAction,
	fetchDashboards: () => ThunkAction,
	validateWidgetToCopy: (widgetId: string) => ThunkAction
|};

export type Props = ConnectedFunctions & ConnectedProps;
