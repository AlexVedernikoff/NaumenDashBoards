// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getSelectedWidget, getSelectedWidgetId} from 'store/widgets/data/selectors';
import {setEditPanelPosition, setHideEditPanel, setWidthEditPanel} from 'store/dashboard/settings/actions';

export const props = (state: AppState): ConnectedProps => {
	const selectedWidgetId = getSelectedWidgetId(state);
	let title = 'Дашборды';

	if (selectedWidgetId) {
		const selectedWidget = getSelectedWidget(state);

		title = selectedWidget.templateName || 'Новый виджет';
	}

	return {
		position: state.dashboard.settings.editPanelPosition,
		selectedWidgetId,
		swiped: state.dashboard.settings.hideEditPanel,
		title,
		width: state.dashboard.settings.widthEditPanel
	};
};

export const functions: ConnectedFunctions = {
	updatePanelPosition: setEditPanelPosition,
	updateSwiped: setHideEditPanel,
	updateWidth: setWidthEditPanel
};
