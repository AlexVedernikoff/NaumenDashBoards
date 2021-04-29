// @flow
import type {AppState} from 'store/types';
import type {ContextState} from 'store/context/types';
import {createSelector} from 'reselect';
import type {DashboardState} from 'store/dashboard/types';
import isMobile from 'ismobilejs';

const getContext = (state: AppState): ContextState => state.context;

const getDashboard = (state: AppState): DashboardState => state.dashboard;

const getDashboardDescription = createSelector(
	getContext,
	getDashboard,
	(context, dashboard) => {
		const {contentCode, subjectUuid: classFqn} = context;

		return {
			classFqn,
			contentCode,
			isMobile: isMobile().any,
			isPersonal: dashboard.settings.personal
		};
	}
);

export {
	getDashboardDescription
};
