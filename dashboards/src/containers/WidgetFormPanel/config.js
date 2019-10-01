// @flow
import type {ConnectedProps} from './types';
import type {FormikConfig, FormikProps, FormikValues} from 'formik';
import {NewWidget} from 'entities';

const config: FormikConfig = {
	mapPropsToValues: ({selectedWidget}: ConnectedProps) => {
		const {id, ...values} = selectedWidget;

		return {
			asDefault: false,
			...values
		};
	},

	handleSubmit: (values: FormikValues, {props}: FormikProps) => {
		const {createWidget, saveWidget, selectedWidget} = props;
		const {asDefault, ...data} = values;

		if (selectedWidget instanceof NewWidget) {
			createWidget(data, asDefault);
		} else {
			saveWidget({...data, id: selectedWidget.id}, asDefault);
		}
	},

	enableReinitialize: true
};

export default config;
