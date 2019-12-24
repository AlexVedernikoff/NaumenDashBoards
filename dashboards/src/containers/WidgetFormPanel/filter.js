// @flow
import {AXIS_FIELDS, CIRCLE_FIELDS, COMBO_FIELDS, SUMMARY_FIELDS, TABLE_FIELDS} from 'components/organisms/WidgetFormPanel/constants/fields';
import {CHART_VARIANTS} from 'utils/chart';
import {DEFAULT_AGGREGATION, DEFAULT_GROUP} from 'components/molecules/AttributeRefInput/constants';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {FormData} from 'components/organisms/WidgetFormPanel/types';
import {createOrdinalName, WIDGET_VARIANTS} from 'utils/widget';

const {
	aggregation,
	breakdown,
	breakdownGroup,
	colors,
	computedAttrs,
	diagramName,
	group,
	layout,
	legendPosition,
	name,
	order,
	showLegend,
	showName,
	showValue,
	showXAxis,
	showYAxis,
	type
} = FIELDS;

const getOrdinalFields = (order: Array<number>, keys: Object) => {
	const fields = [];

	order.forEach(number => {
		Object.keys(keys).forEach(key => {
			fields.push(createOrdinalName(key, number));
		});
	});

	return fields;
};

const getAxisChartFields = (order: Array<number>) => {
	const fields = [
		colors,
		legendPosition,
		showLegend,
		showValue,
		showXAxis,
		showYAxis
	];

	return [...fields, ...getOrdinalFields(order, AXIS_FIELDS)];
};

const getCircleChartFields = (order: Array<number>) => {
	const fields = [
		colors,
		legendPosition,
		showLegend,
		showValue
	];

	return [...fields, ...getOrdinalFields(order, CIRCLE_FIELDS)];
};

const getComboChartFields = (order: Array<number>) => {
	const fields = [
		colors,
		legendPosition,
		showLegend,
		showValue
	];

	return [...fields, ...getOrdinalFields(order, COMBO_FIELDS)];
};

const getSummaryFields = (order: Array<number>) => getOrdinalFields(order, SUMMARY_FIELDS);

const getTableFields = (order: Array<number>) => getOrdinalFields(order, TABLE_FIELDS);

const defaultFields = [
	computedAttrs,
	diagramName,
	layout,
	name,
	order,
	showName,
	type
];

const getDefaultValue = (key: string) => {
	if (/^type_(.*)$/.test(key)) {
		return CHART_VARIANTS.COLUMN;
	}

	if (key.startsWith(aggregation)) {
		return DEFAULT_AGGREGATION.COUNT;
	}

	if (key.startsWith(group) || key.startsWith(breakdownGroup)) {
		return DEFAULT_GROUP.OVERLAP;
	}

	return null;
};

const resolve = (type: string) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;

	const variants = {
		[BAR]: getAxisChartFields,
		[BAR_STACKED]: getAxisChartFields,
		[COLUMN]: getAxisChartFields,
		[COLUMN_STACKED]: getAxisChartFields,
		[COMBO]: getComboChartFields,
		[DONUT]: getCircleChartFields,
		[LINE]: getAxisChartFields,
		[PIE]: getCircleChartFields,
		[SUMMARY]: getSummaryFields,
		[TABLE]: getTableFields
	};

	return variants[type];
};

const filter = (data: FormData): any => {
	const {order, type} = data;
	const filteredData = {};
	const breakdownReg = new RegExp(`^${breakdown}(_.*|$)`);

	[...defaultFields, ...resolve(type)(order)].forEach(key => {
		let value = data[key] || null;

		if (!value) {
			value = getDefaultValue(key);
		}

		// $FlowFixMe
		if (value && breakdownReg.test(key) && !value.code) {
			value = null;
		}

		filteredData[key] = value;
	});

	return filteredData;
};

export default filter;
