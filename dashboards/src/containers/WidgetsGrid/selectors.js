// @flow
import {addNewWidget, focusWidget, resetFocusedWidget} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import {changeLayouts} from 'store/dashboard/layouts/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getAllWidgets} from 'store/widgets/data/selectors';
import {USER_ROLES} from 'store/context/constants';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets} = state;
	const {layouts: dashboardLayouts, settings} = dashboard;
	const {editMode, layoutMode, personal: personalDashboard} = settings;
	const {data} = widgets;
	const {focusedWidget, selectedWidget} = data;
	const {editableDashboard, user} = context;
	const editable = user.role !== USER_ROLES.REGULAR || personalDashboard;
	const widgetsList = getAllWidgets(state);
	const showCreationInfo = editable && widgetsList?.length === 0;

	return {
		editMode,
		editableDashboard,
		focusedWidget,
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
	resetFocusedWidget
};
