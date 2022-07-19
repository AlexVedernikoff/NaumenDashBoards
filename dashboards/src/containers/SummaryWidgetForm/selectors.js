// @flow
import type {AppState} from 'store/types';
import {changeLayout} from 'store/dashboard/layouts/actions';
import {changeSummaryFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveWidget} from 'store/widgets/actions';

export const props = (state: AppState): ConnectedProps => ({
	layoutMode: state.dashboard.settings.layoutMode,
	values: state.widgetForms.summaryForm
});

export const functions: ConnectedFunctions = {
	onChange: changeSummaryFormValues,
	onChangeLayout: changeLayout,
	onSave: saveWidget
};
