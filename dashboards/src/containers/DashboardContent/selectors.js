// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {drillDown} from 'store/widgets/links/actions';
import {editLayout, editWidgetChunkData, removeWidget, selectWidget, updateWidget} from 'store/widgets/data/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {USER_ROLES} from 'store/context/constants';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets} = state;
	const {editMode, layoutMode, personal: personalDashboard} = dashboard;
	const {buildData, data} = widgets;
	const {newWidget, selectedWidget} = data;
	const editable = context.user.role !== USER_ROLES.REGULAR || personalDashboard;
	const {user} = context;

	return {
		buildData,
		editMode,
		editable,
		layoutMode,
		newWidget,
		personalDashboard,
		selectedWidget,
		user,
		// $FlowFixMe
		widgets: Object.values(data.map)
	};
};

export const functions: ConnectedFunctions = {
	drillDown,
	editLayout,
	editWidgetChunkData,
	fetchBuildData,
	removeWidget,
	selectWidget,
	updateWidget
};
