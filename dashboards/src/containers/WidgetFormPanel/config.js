// @flow
import type {ConnectedProps} from './types';
import type {FormikConfig, FormikProps, FormikValues} from 'formik';
import {NewWidget} from 'entities';
import {typeOfCircleCharts} from 'utils/chart';
import {typeOfExtendedGroups} from 'utils/group';
import * as Yup from 'yup';

const toNull = () => null;

const validateByTypeChart = (requiredText: string) => ({
	is: chart => !typeOfCircleCharts(chart),
	then: Yup.object().nullable().required(requiredText),
	otherwise: Yup.object().nullable().transform(toNull)
});

const schema = Yup.object().shape({
	aggregate: Yup.object().nullable()
		.when('chart', validateByTypeChart('Укажите тип агрегации')),
	breakdown: Yup.object().nullable()
		.when('chart', {
			is: chart => typeOfCircleCharts(chart),
			then: Yup.object().nullable().required('Укажите способ разбивки')
		}),
	chart: Yup.object().nullable()
		.required('Выберите тип графика.'),
	group: Yup.object().nullable()
		.when('xAxis', {
			is: (xAxis) => typeOfExtendedGroups(xAxis),
			then: Yup.object().required('Укажите способ группировки'),
			otherwise: Yup.object().nullable().transform(toNull)
		}),
	name: Yup.string()
		.required('Укажите название виджета'),
	source: Yup.object().nullable()
		.required('Укажите источник данных'),
	xAxis: Yup.object()
		.when('chart', validateByTypeChart('Укажите атрибут для оси X')),
	yAxis: Yup.object()
		.when('chart', validateByTypeChart('Укажите атрибут для оси Y'))
});

const config: FormikConfig = {
	mapPropsToValues: ({selectedWidget}: ConnectedProps) => {
		const {id, ...values} = selectedWidget;

		return {
			asDefault: false,
			...values
		};
	},

	validationSchema: schema,

	handleSubmit: (values: FormikValues, {props}: FormikProps) => {
		const {createWidget, saveWidget, selectedWidget} = props;
		const {asDefault, ...data} = values;
		const castedData = schema.cast(data);

		if (selectedWidget instanceof NewWidget) {
			createWidget({...castedData}, asDefault);
		} else {
			saveWidget({...castedData, id: selectedWidget.id}, asDefault);
		}
	},

	enableReinitialize: true
};

export default config;
