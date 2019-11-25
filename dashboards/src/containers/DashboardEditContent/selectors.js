// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editLayout, removeWidget, selectWidget} from 'store/widgets/data/actions';

export const props = (state: AppState): ConnectedProps => ({
	newWidget: state.widgets.data.newWidget,
	role: state.dashboard.role,
	selectedWidget: state.widgets.data.selectedWidget,
	widgets: state.widgets.data.map
});

export const functions: ConnectedFunctions = {
	editLayout,
	removeWidget,
	selectWidget
};
