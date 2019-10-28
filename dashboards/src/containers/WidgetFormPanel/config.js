// @flow
import {CHART_SELECTS} from 'utils/chart';
import type {ConnectedProps, ValidateType} from './types';
import filter from './filter';
import type {FormikConfig, FormikProps, FormikValues} from 'formik';
import {lazy} from 'yup';
import {NewWidget} from 'utils/widget';
import getSchema from './schemas.js';

const config: FormikConfig = {
	mapPropsToValues: ({selectedWidget}: ConnectedProps) => {
		const {id, layout, type, ...values} = selectedWidget;

		return {
			asDefault: false,
			type: type || CHART_SELECTS.AXIS_SELECTS[0],
			...values
		};
	},

	validationSchema: () => lazy((values: ValidateType) => getSchema(values)),

	handleSubmit: (values: FormikValues, {props}: FormikProps) => {
		const {createWidget, saveWidget, selectedWidget} = props;
		const {asDefault, ...data} = values;
		const filteredData = filter(data);

		if (selectedWidget instanceof NewWidget) {
			createWidget(filteredData, asDefault);
		} else {
			saveWidget({...filteredData, id: selectedWidget.id}, asDefault);
		}
	},

	enableReinitialize: true
};

export default config;
