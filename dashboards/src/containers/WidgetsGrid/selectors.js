// @flow
import {addNewWidget, focusWidget, resetFocusedWidget, resetWidget} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import {changeLayouts} from 'store/dashboard/layouts/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {DASHBOARD_EDIT_MODE, USER_ROLES} from 'store/context/constants';
import {getAllWidgets} from 'store/widgets/data/selectors';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets} = state;
	const {layouts: dashboardLayouts, settings} = dashboard;
	const {editMode, isMobileDevice, layoutMode, personal: personalDashboard} = settings;
	const {data} = widgets;
	const {focusedWidget, selectedWidget} = data;
	const {dashboardMode, user} = context;
	const hasCreateNewWidget = user.role !== USER_ROLES.REGULAR || personalDashboard;
	const widgetsList = getAllWidgets(state);
	const showCreationInfo = hasCreateNewWidget && widgetsList?.length === 0;
	const editableDashboard = dashboardMode === DASHBOARD_EDIT_MODE.EDIT;

	return {
		editMode,
		editableDashboard,
		focusedWidget,
		hasCreateNewWidget,
		isMobileDevice,
		layoutMode,
		layouts: dashboardLayouts[layoutMode],
		selectedWidget,
		showCreationInfo,
		user,
		widgets: widgetsList
	};
};

export const functions: ConnectedFunctions = {
	addNewWidget,
	changeLayouts,
	focusWidget,
	resetFocusedWidget,
	resetWidget
};
