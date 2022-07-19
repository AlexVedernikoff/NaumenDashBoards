// @flow
import type {AppState} from 'store/types';
import {changeSpeedometerFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveWidget} from 'store/widgets/actions';

export const props = (state: AppState): ConnectedProps => ({
	values: state.widgetForms.speedometerForm
});

export const functions: ConnectedFunctions = {
	onChange: changeSpeedometerFormValues,
	onSave: saveWidget
};
