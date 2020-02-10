// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {drillDown} from 'store/widgets/links/actions';
import {editLayout, removeWidget, selectWidget} from 'store/widgets/data/actions';
import {USER_ROLES} from 'store/context/constants';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets} = state;
	const {editMode, personal: personalDashboard} = dashboard;
	const {buildData, data} = widgets;
	const {newWidget, selectedWidget} = data;
	const editable = context.user.role !== USER_ROLES.REGULAR || personalDashboard;

	return {
		buildData,
		editable,
		editMode,
		newWidget,
		personalDashboard,
		selectedWidget,
		// $FlowFixMe
		widgets: Object.values(data.map)
	};
};

export const functions: ConnectedFunctions = {
	drillDown,
	editLayout,
	removeWidget,
	selectWidget
};
