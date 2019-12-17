// @flow
import type {AppState} from 'store/types';
import {comboDrillDown, drillDown} from 'store/widgets/links/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editLayout, removeWidget, selectWidget} from 'store/widgets/data/actions';

export const props = (state: AppState): ConnectedProps => {
	const {dashboard, widgets} = state;
	const {editable, editMode, role} = dashboard;
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
	comboDrillDown,
	drillDown,
	editLayout,
	removeWidget,
	selectWidget
};
