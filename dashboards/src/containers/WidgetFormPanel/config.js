// @flow
import {AXIS_FIELDS, CIRCLE_FIELDS} from 'components/organisms/WidgetFormPanel/constants/fields';
import {CHART_VARIANTS} from 'utils/chart';
import type {ConnectedProps, ValidateType} from './types';
import {createOrdinalName, NewWidget} from 'utils/widget';
import {FIELDS, SETTINGS} from 'components/organisms/WidgetFormPanel';
import filter from './filter';
import type {FormikConfig, FormikProps, FormikValues} from 'formik';
import {lazy} from 'yup';
import getSchema from './schemas.js';

// TODO убрать как будут перенастроенны все виджеты
const getType = (type: string) => {
	if (type && typeof type === 'object') {
		return type.value;
	} else if (type) {
		return type;
	}

	return CHART_VARIANTS.COLUMN;
};

const transformLegacyValues = (type: string, values: FormikValues) => {
	const {DONUT, PIE} = CHART_VARIANTS;
	const fields = type === DONUT || type === PIE ? CIRCLE_FIELDS : AXIS_FIELDS;

	Object.keys(fields).forEach(field => {
		values[createOrdinalName(field, SETTINGS.FIRST_KEY)] = values[field];
	});

	return values;
};

const config: FormikConfig = {
	mapPropsToValues: ({selectedWidget}: ConnectedProps) => {
		const {id, layout, type, ...values} = selectedWidget;
		const formValues = Object.prototype.hasOwnProperty.call(values, FIELDS.order) ? values : transformLegacyValues(type, values);

		return {
			asDefault: false,
			isNew: id === NewWidget.id,
			type: getType(type),
			...formValues
		};
	},

	validationSchema: () => lazy((values: ValidateType) => getSchema(values)),

	handleSubmit: (values: FormikValues, {props}: FormikProps) => {
		const {createWidget, saveWidget, selectedWidget} = props;
		const {asDefault, isNew, ...data} = values;
		const filteredData = filter(data);

		isNew ? createWidget(filteredData, asDefault) : saveWidget({...filteredData, id: selectedWidget.id}, asDefault);
	},

	enableReinitialize: true
};

export default config;
