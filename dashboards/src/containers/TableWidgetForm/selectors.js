// @flow
import type {AppState} from 'store/types';
import {changeTableFormValues} from 'store/widgetForms/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {saveWidget} from 'store/widgets/actions';

export const props = (state: AppState): ConnectedProps => ({
	values: state.widgetForms.tableForm
});

export const functions: ConnectedFunctions = {
	onChange: changeTableFormValues,
	onSave: saveWidget
};
