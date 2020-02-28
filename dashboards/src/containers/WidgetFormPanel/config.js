// @flow
import {AXIS_FIELDS, CIRCLE_FIELDS} from 'components/organisms/WidgetFormPanel/constants/fields';
import {CHART_VARIANTS} from 'utils/chart';
import type {ConnectedProps} from './types';
import {createOrdinalName, NewWidget, WIDGET_VARIANTS} from 'utils/widget';
import {FIELDS, SETTINGS} from 'components/organisms/WidgetFormPanel';
import filter from './filter';
import type {FormikConfig, FormikProps, FormikValues} from 'formik';
import getSchema from './schemas.js';
import {lazy} from 'yup';

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
			diagramName: '',
			isNew: id === NewWidget.id,
			isSubmitting: false,
			name: '',
			type: getType(type),
			...formValues
		};
	},

	validationSchema: () => lazy((values: FormikValues) => values.isSubmitting && getSchema(values)),

	handleSubmit: (values: FormikValues, {props}: FormikProps) => {
		const {createWidget, saveWidget, selectedWidget} = props;
		const {isNew, ...data} = values;
		const filteredData = filter(data, selectedWidget);

		if (filteredData.type === WIDGET_VARIANTS.TABLE && Array.isArray(selectedWidget.rowsWidth)) {
			filteredData.rowsWidth = selectedWidget.rowsWidth;
		}

		isNew ? createWidget(filteredData) : saveWidget({...filteredData, id: selectedWidget.id});
	},

	enableReinitialize: false
};

export default config;
