// @flow
import {CHART_SELECTS} from 'utils/chart';
import type {ConnectedProps} from './types';
import type {FormikConfig, FormikProps, FormikValues} from 'formik';
import {NewWidget} from 'utils/widget';

const config: FormikConfig = {
	mapPropsToValues: ({selectedWidget}: ConnectedProps) => {
		const {id, type, ...values} = selectedWidget;

		return {
			asDefault: false,
			type: type || CHART_SELECTS.AXIS_SELECTS[0],
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
