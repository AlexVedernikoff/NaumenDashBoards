// @flow
import type {AppState} from 'store/types';
import {cancelForm, createWidget, saveWidget} from 'store/widgets/data/actions';
import {changeLayout} from 'store/dashboard/layouts/actions';
import {changeLayoutMode} from 'store/dashboard/settings/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createToast} from 'store/toasts/actions';
import {getMapValues} from 'helpers';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, widgets: widgetsState} = state;
	const {layoutMode, personal: personalDashboard} = dashboard.settings;
	const {data} = widgetsState;
	const {map, selectedWidget} = data;
	const {contentCode, subjectUuid, user} = context;
	const contentContext = {contentCode, subjectUuid};
	const widget = data.map[selectedWidget];
	const widgets = getMapValues(map).filter(({id}) => id !== selectedWidget);

	return {
		context: contentContext,
		layoutMode,
		personalDashboard,
		saving: data.saving,
		user,
		widget,
		widgets
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
