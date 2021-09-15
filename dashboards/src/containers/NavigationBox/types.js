// @flow
import type {DashboardsState, FetchDashboards} from 'store/dashboards/types';
import type {UserData} from 'store/context/types';

export type ConnectedProps = {
	dashboards: DashboardsState,
	isEditableContext: boolean,
	user: UserData
};

export type ConnectedFunctions = {
	fetchDashboards: FetchDashboards
};

export type Props = ConnectedProps & ConnectedFunctions;
