// @flow
import type {AppState} from 'store/types';
import {changeLayouts} from 'store/dashboard/layouts/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {drillDown, openCardObject} from 'store/widgets/links/actions';
import {editWidgetChunkData, removeWidget, selectWidget, updateWidget} from 'store/widgets/data/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {getMapValues} from 'src/helpers';
import {USER_ROLES} from 'store/context/constants';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets} = state;
	const {layouts: dashboardLayouts, settings} = dashboard;
	const {editMode, layoutMode, personal: personalDashboard} = settings;
	const {buildData, data} = widgets;
	const {selectedWidget} = data;
	const {user} = context;
	const editable = context.user.role !== USER_ROLES.REGULAR || personalDashboard;

	return {
		buildData,
		editMode,
		editable,
		layoutMode,
		layouts: dashboardLayouts[layoutMode],
		personalDashboard,
		selectedWidget,
		user,
		widgets: getMapValues(data.map)
	};
};

export const functions: ConnectedFunctions = {
	changeLayouts,
	drillDown,
	editWidgetChunkData,
	fetchBuildData,
	openCardObject,
	removeWidget,
	selectWidget,
	updateWidget
};
