// @flow
import {
	addWidget,
	clearWarningMessage,
	editWidgetChunkData,
	focusWidget,
	removeWidget,
	resetFocusedWidget,
	selectWidget,
	updateWidget
} from 'store/widgets/data/actions';
import type {AppState, Dispatch} from 'store/types';
import {changeLayouts} from 'store/dashboard/layouts/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createNewWidget} from 'store/widgets/data/helpers';
import {drillDown, openCardObject, openNavigationLink} from 'store/widgets/links/actions';
import {editDashboard} from 'store/dashboard/settings/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {getMapValues} from 'helpers';
import type {LayoutMode} from 'store/dashboard/settings/types';
import {USER_ROLES} from 'store/context/constants';
import type {WidgetType} from 'store/widgets/data/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const createNewWidgetAction = (type?: WidgetType) => (layout: LayoutMode) => (dispatch: Dispatch) => {
	const newWidget = createNewWidget(layout, type);

	dispatch(addWidget(newWidget));
	dispatch(editDashboard());
};

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets} = state;
	const {layouts: dashboardLayouts, settings} = dashboard;
	const {editMode, layoutMode, personal: personalDashboard} = settings;
	const {buildData, data} = widgets;
	const {focusedWidget, selectedWidget} = data;
	const {editableDashboard, user} = context;
	const editable = user.role !== USER_ROLES.REGULAR || personalDashboard;
	const widgetsList = getMapValues(data.map);
	const showCreationInfo = editable && (widgetsList?.length === 0);

	return {
		buildData,
		editMode,
		editable,
		editableDashboard,
		focusedWidget,
		layoutMode,
		layouts: dashboardLayouts[layoutMode],
		personalDashboard,
		selectedWidget,
		showCreationInfo,
		user,
		widgets: widgetsList
	};
};

export const functions: ConnectedFunctions = {
	changeLayouts,
	clearWarningMessage,
	createNewTextWidget: createNewWidgetAction(WIDGET_TYPES.TEXT),
	createNewWidget: createNewWidgetAction(),
	drillDown,
	editWidgetChunkData,
	fetchBuildData,
	focusWidget,
	openCardObject,
	openNavigationLink,
	removeWidget,
	resetFocusedWidget,
	selectWidget,
	updateWidget
};
