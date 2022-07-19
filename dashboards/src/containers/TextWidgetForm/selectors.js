// @flow
import type {AppState} from 'store/types';
import {cancelForm} from 'store/widgets/data/actions';
import {changeTextFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveWidget} from 'store/widgets/actions';

export const props = (state: AppState): ConnectedProps => ({
	saving: state.widgets.data.saving.loading,
	values: state.widgetForms.textForm
});

export const functions: ConnectedFunctions = {
	changeValues: changeTextFormValues,
	onCancel: cancelForm,
	save: saveWidget
};
