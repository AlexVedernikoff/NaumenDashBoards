// @flow
import type {AppState} from 'store/types';
import {cancelWidgetCreate} from 'store/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getSelectedWidget, getSelectedWidgetId} from 'store/widgets/data/selectors';
import NewWidget from 'store/widgets/data/NewWidget';
import {setEditPanelPosition, setHideEditPanel, setWidthEditPanel} from 'store/dashboard/settings/actions';
import t from 'localization';

export const props = (state: AppState): ConnectedProps => {
	const selectedWidgetId = getSelectedWidgetId(state);
	let title = t('DashboardPanel::Dashboards');
	const showBackButton = selectedWidgetId === NewWidget.id;

	if (selectedWidgetId) {
		const selectedWidget = getSelectedWidget(state);

		title = selectedWidget.templateName || t('DashboardPanel::NewWidget');
	}

	return {
		position: state.dashboard.settings.editPanelPosition,
		selectedWidgetId,
		showBackButton,
		showCopyPanel: state.dashboard.settings.showCopyPanel,
		swiped: state.dashboard.settings.hideEditPanel,
		title,
		width: state.dashboard.settings.widthEditPanel
	};
};

export const functions: ConnectedFunctions = {
	goBack: cancelWidgetCreate,
	updatePanelPosition: setEditPanelPosition,
	updateSwiped: setHideEditPanel,
	updateWidth: setWidthEditPanel
};
