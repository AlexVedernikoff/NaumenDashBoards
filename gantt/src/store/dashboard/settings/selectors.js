// @flow
import type {AppState} from 'store/types';
import type {ContextState} from 'store/context/types';
import {createSelector} from 'reselect';
import type {DashboardState} from 'store/dashboard/types';
import isMobile from 'ismobilejs';

const getContext = (state: AppState): ContextState => state.context;

const getDashboard = (state: AppState): DashboardState => state.dashboard;

const isPersonalDashboard = createSelector(
	getDashboard,
	(dashboard: DashboardState) => dashboard.settings.personal
);

const getDashboardDescription = createSelector(
	getContext,
	getDashboard,
	isPersonalDashboard,
	(context, dashboard, isPersonal) => {
		const {contentCode, subjectUuid: classFqn} = context;

		return {
			classFqn,
			contentCode,
			isMobile: isMobile().any,
			isPersonal
		};
	}
);

export {
	getDashboardDescription,
	isPersonalDashboard
};
