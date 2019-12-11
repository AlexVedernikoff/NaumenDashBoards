// @flow
import type {FormikConfig, FormikProps, FormikValues} from 'formik';
import {MAX_INTERVAL} from './constants';
import {number, object} from 'yup';
import type {Props} from './types';

const config: FormikConfig = {
	mapPropsToValues: (props: Props) => {
		const {defaultInterval, enabled, interval} = props;

		return {
			enabled,
			interval: interval || defaultInterval
		};
	},

	validationSchema: (props: Props) => {
		const {defaultInterval} = props;

		return object({
			interval: number().min(defaultInterval).max(MAX_INTERVAL).required()
		});
	},

	handleSubmit: (values: FormikValues, {props}: FormikProps) => props.saveAutoUpdateSettings(values),

	enableReinitialize: true
};

export default config;
