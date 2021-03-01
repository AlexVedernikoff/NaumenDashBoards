// @flow
import type {AppState} from 'store/types';
import {cancelForm, createWidget, saveWidget} from 'store/widgets/data/actions';
import {changeLayout} from 'store/dashboard/layouts/actions';
import {changeLayoutMode} from 'store/dashboard/settings/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createToast} from 'store/toasts/actions';
import {getAllWidgetsWithoutSelected, getSelectedWidget} from 'src/store/widgets/data/selectors';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets: widgetsState} = state;
	const {layoutMode, personal: personalDashboard} = dashboard.settings;
	const {data} = widgetsState;
	const {contentCode, subjectUuid, user} = context;
	const contentContext = {contentCode, subjectUuid};

	return {
		context: contentContext,
		layoutMode,
		personalDashboard,
		saving: data.saving,
		user,
		widget: getSelectedWidget(state),
		widgets: getAllWidgetsWithoutSelected(state)
	};
};

export const functions: ConnectedFunctions = {
	cancelForm,
	changeLayout,
	changeLayoutMode,
	createToast,
	createWidget,
	saveWidget
};
