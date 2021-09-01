// @flow
import {addNewWidget, copyWidget, validateWidgetToCopy} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchDashboards} from 'store/dashboards/actions';
import {isUserModeDashboard} from 'store/dashboard/settings/selectors';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	dashboards: state.dashboards,
	isUserMode: isUserModeDashboard(state),
	layoutMode: state.dashboard.settings.layoutMode,
	personalDashboard: state.dashboard.settings.personal,
	user: state.context.user,
	widgets: state.widgets.data.map
});

export const functions: ConnectedFunctions = {
	addNewWidget,
	copyWidget,
	fetchDashboards,
	validateWidgetToCopy
};
