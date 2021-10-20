// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {DASHBOARD_EDIT_MODE} from 'store/context/constants';

export const props = (state: AppState): ConnectedProps => {
	const {editMode, isMobileDevice} = state.dashboard.settings;
	const {dashboardMode, user} = state.context;
	const editableDashboard = dashboardMode === DASHBOARD_EDIT_MODE.EDIT;

	return {
		editMode,
		editableDashboard,
		isMobileDevice,
		user
	};
};
