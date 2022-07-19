// @flow
import type {AppState} from 'store/types';
import {changeCircleChartFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveChartWidget} from 'store/widgets/actions';

export const props = (state: AppState): ConnectedProps => ({
	values: state.widgetForms.circleChartForm
});

export const functions: ConnectedFunctions = {
	onChange: changeCircleChartFormValues,
	onSave: saveChartWidget
};
