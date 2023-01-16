// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createSelector} from 'reselect';
import {DASHBOARD_EDIT_MODE, USER_ROLES} from 'store/context/constants';
import {getSettings, saveAutoUpdateSettings} from 'store/dashboard/settings/actions';
import {isPersonalDashboard} from 'store/dashboard/settings/selectors';

const getCanChangeConfiguration = createSelector(
	state => state.context,
	isPersonalDashboard,
	(context, isPersonal) => {
		let result = false;
		const {dashboardMode, user} = context;
		const isRegular = user.role === USER_ROLES.REGULAR;

		switch (dashboardMode) {
			case DASHBOARD_EDIT_MODE.EDIT:
				result = isPersonal ? isRegular : !isRegular;
				break;
			case DASHBOARD_EDIT_MODE.VIEW_ONLY:
				result = !isRegular;
				break;
			case DASHBOARD_EDIT_MODE.USER:
			case DASHBOARD_EDIT_MODE.USER_SOURCE:
				result = isRegular;
				break;
		}

		return result;
	}
);

export const props = (state: AppState): ConnectedProps => ({
	canChangeConfiguration: getCanChangeConfiguration(state),
	settings: state.dashboard.settings.autoUpdate
});

export const functions: ConnectedFunctions = {
	getSettings,
	onSaveSettings: saveAutoUpdateSettings
};
