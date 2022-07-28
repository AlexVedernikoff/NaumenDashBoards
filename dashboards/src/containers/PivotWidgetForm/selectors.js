// @flow
import type {AppState} from 'store/types';
import {changePivotFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveWidget} from 'store/widgets/actions';

export const props = (state: AppState): ConnectedProps => ({
	values: state.widgetForms.pivotForm
});

export const functions: ConnectedFunctions = {
	onChange: changePivotFormValues,
	onSave: saveWidget
};
