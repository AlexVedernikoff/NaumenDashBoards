// @flow
import type {AppState} from 'store/types';
import type {ContextState} from 'store/context/types';
import {createSelector} from 'reselect';
import {DASHBOARD_EDIT_MODE} from 'store/context/constants';
import type {DashboardState} from 'store/dashboard/types';
import isMobile from 'ismobilejs';

const getContext = (state: AppState): ContextState => state.context;

const getDashboard = (state: AppState): DashboardState => state.dashboard;

const isPersonalDashboard = createSelector(
	getDashboard,
	(dashboard: DashboardState) => dashboard.settings.personal
);

const isUserModeDashboard = createSelector(
	getContext,
	({dashboardMode}) => dashboardMode === DASHBOARD_EDIT_MODE.USER || dashboardMode === DASHBOARD_EDIT_MODE.USER_SOURCE
);

const isRestrictUserModeDashboard = createSelector(
	getContext,
	({dashboardMode}) => dashboardMode === DASHBOARD_EDIT_MODE.USER_SOURCE
);

const getDashboardDescription = createSelector(
	getContext,
	getDashboard,
	isPersonalDashboard,
	isUserModeDashboard,
	(context, dashboard, isPersonal, isForUser) => {
		const {contentCode, subjectUuid: classFqn} = context;

		return {
			classFqn,
			contentCode,
			isForUser,
			isMobile: isMobile().any,
			isPersonal
		};
	}
);

export {
	isUserModeDashboard,
	isRestrictUserModeDashboard,
	getDashboardDescription,
	isPersonalDashboard
};
