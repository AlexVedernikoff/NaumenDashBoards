// @flow
import {addNewWidget, validateWidgetToCopy} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {copyWidget} from 'store/widgets/actions';
import {fetchDashboards} from 'store/dashboards/actions';
import {isEditableDashboardContext, isUserModeDashboard} from 'store/dashboard/settings/selectors';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	dashboards: state.dashboards,
	isEditableContext: isEditableDashboardContext(state),
	isUserMode: isUserModeDashboard(state),
	layoutMode: state.dashboard.settings.layoutMode,
	user: state.context.user,
	widgets: state.widgets.data.map
});

export const functions: ConnectedFunctions = {
	addNewWidget,
	copyWidget,
	fetchDashboards,
	validateWidgetToCopy
};
