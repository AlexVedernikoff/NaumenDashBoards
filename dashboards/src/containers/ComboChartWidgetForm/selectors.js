// @flow
import type {AppState} from 'store/types';
import {changeComboChartFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveWidget} from 'store/widgets/actions';

export const props = (state: AppState): ConnectedProps => ({
	customGroups: state.customGroups.map,
	values: state.widgetForms.comboChartForm
});

export const functions: ConnectedFunctions = {
	onChange: changeComboChartFormValues,
	onSave: saveWidget
};
