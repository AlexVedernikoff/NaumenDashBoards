// @flow
import type {ConnectedProps} from './types';
import type {FormikConfig, FormikProps, FormikValues} from 'formik';
import {NewWidget} from 'entities';
import * as Yup from 'yup';

const config: FormikConfig = {
	mapPropsToValues: ({selectedWidget}: ConnectedProps) => {
		const {
			aggregate,
			chart,
			desc,
			group,
			isNameShown,
			name,
			source,
			xAxis,
			yAxis
		} = selectedWidget;

		return {
			aggregate,
			chart,
			desc,
			group,
			isNameShown,
			name,
			source,
			xAxis,
			yAxis
		};
	},

	validationSchema: Yup.object().shape({
		aggregate: Yup.object().nullable()
			.required('Выберите тип агрегации'),
		chart: Yup.object().nullable()
			.required('Выберите тип графика.'),
		group: Yup.object().nullable()
			.required('Укажите способ группировки'),
		name: Yup.string()
			.required('Укажите название виджета'),
		source: Yup.object()
			.required('Укажите источник данных'),
		xAxis: Yup.object().nullable()
			.required('Укажите атрибут для оси X'),
		yAxis: Yup.object().nullable()
			.required('Укажите атрибут для оси Y')
	}),

	handleSubmit: (values: FormikValues, {props}: FormikProps) => {
		const {createWidget, saveWidget, selectedWidget} = props;

		selectedWidget instanceof NewWidget ? createWidget({layout: selectedWidget.layout, ...values}) : saveWidget(values, selectedWidget.id);
	},
	enableReinitialize: true
};

export default config;
