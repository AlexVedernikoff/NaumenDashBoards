// @flow
import type {AppState} from 'store/types';
import {changeTextFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveWidget} from 'store/widgets/data/actions';

export const props = (state: AppState): ConnectedProps => ({
	saving: state.widgets.data.saving.loading,
	values: state.widgetForms.textForm
});

export const functions: ConnectedFunctions = {
	changeValues: changeTextFormValues,
	save: saveWidget
};
