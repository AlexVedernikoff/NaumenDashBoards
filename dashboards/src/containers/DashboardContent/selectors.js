// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {drillDown} from 'store/widgets/links/actions';
import {editLayout, removeWidget, selectWidget} from 'store/widgets/data/actions';

export const props = (state: AppState): ConnectedProps => {
	const {dashboard, widgets} = state;
	const {editMode, editable, role} = dashboard;
	const {buildData, data} = widgets;
	const {newWidget, selectedWidget} = data;

	return {
		buildData,
		editable,
		editMode,
		newWidget,
		role,
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
