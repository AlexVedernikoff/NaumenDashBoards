// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editLayout, selectWidget} from 'store/widgets/data/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	charts: state.widgets.charts.map,
	isEditable: state.dashboard.isEditable,
	newWidget: state.widgets.data.newWidget,
	selectedWidget: state.widgets.data.selectedWidget,
	widgets: state.widgets.data.map
});

export const functions: ConnectedFunctions = {
	editLayout,
	selectWidget
};
