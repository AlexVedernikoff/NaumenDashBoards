// @flow
import {
	addNewWidget,
	focusWidget,
	resetFocusedWidget,
	resetWidget
} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import {changeLayouts, setLayoutsChanged} from 'store/dashboard/layouts/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {DASHBOARD_EDIT_MODE, USER_ROLES} from 'store/context/constants';
import {DISPLAY_MODE} from 'store/widgets/data/constants';
import {getAllFullWidgets} from 'store/widgets/data/selectors';
import {isEditableDashboardContext, isUserModeDashboard} from 'store/dashboard/settings/selectors';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets} = state;
	const {layouts: dashboardLayouts, settings} = dashboard;
	const {editMode, isMobileDevice, layoutMode} = settings;
	const {data} = widgets;
	const {focusedWidget, selectedWidget} = data;
	const {dashboardMode, user} = context;
	const isUserMode = isUserModeDashboard(state);
	const isEditableContext = isEditableDashboardContext(state);
	const hasCreateNewWidget = user.role !== USER_ROLES.REGULAR || isEditableContext;
	const widgetsList = getAllFullWidgets(state);
	const showCreationInfo = hasCreateNewWidget && widgetsList?.length === 0;
	const editableDashboard = dashboardMode === DASHBOARD_EDIT_MODE.EDIT || isUserMode;
	const newWidgetDisplay = isUserMode ? DISPLAY_MODE.ANY : layoutMode;

	return {
		editMode,
		editableDashboard,
		focusedWidget,
		hasCreateNewWidget,
		isMobileDevice,
		isUserMode,
		layoutMode,
		layouts: dashboardLayouts[layoutMode],
		newWidgetDisplay,
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
	resetWidget,
	setLayoutsChanged
};
