// @flow
import type {AppState} from 'store/types';
import {changeAxisChartFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveChartWidget} from 'store/widgets/actions';

export const props = (state: AppState): ConnectedProps => ({
	customGroups: state.customGroups.map,
	values: state.widgetForms.axisChartForm
});

export const functions: ConnectedFunctions = {
	onChange: changeAxisChartFormValues,
	onSave: saveChartWidget
};
