// @flow
import type {DashboardsState, FetchDashboardsAction} from 'store/dashboards/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {
	dashboards: DashboardsState,
	isEditableContext: boolean,
	user: UserData
};

export type ConnectedFunctions = {
	fetchDashboards: FetchDashboardsAction
};

export type Props = ConnectedProps & ConnectedFunctions;
