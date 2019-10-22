// @flow
import {CHART_VARIANTS} from 'utils/chart';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {FormData} from 'components/organisms/WidgetFormPanel/types';
import {createOrderName, WIDGET_VARIANTS} from 'utils/widget';

const compositeFields = (data: FormData, {base, dynamic}) => () => {
	const {order} = data;

	if (Array.isArray(order)) {
		order.forEach(num => {
			const fields = data[createOrderName(num)(sourceForCompute)] ? [dataKey, descriptor, source, sourceForCompute] : dynamic;

			fields.forEach(baseName => {
				base.push(createOrderName(num)(baseName));
			});
		});
	}

	return base;
};

const {
	aggregation,
	breakdown,
	calcTotalColumn,
	calcTotalRow,
	colors,
	column,
	computedAttrs,
	dataKey,
	descriptor,
	diagramName,
	group,
	indicator,
	layout,
	legendPosition,
	name,
	order,
	row,
	showLegend,
	showName,
	showValue,
	showXAxis,
	showYAxis,
	source,
	sourceForCompute,
	type,
	xAxis,
	yAxis
} = FIELDS;

const axisChartFields = [
	aggregation,
	breakdown,
	colors,
	descriptor,
	group,
	legendPosition,
	showLegend,
	showName,
	showValue,
	showXAxis,
	showYAxis,
	source,
	xAxis,
	yAxis
];

const circleChartFields = [
	aggregation,
	breakdown,
	colors,
	descriptor,
	indicator,
	legendPosition,
	showLegend,
	showValue,
	source
];

const orderFields = [
	computedAttrs,
	order
];

const comboFields = {
	base: [
		colors,
		legendPosition,
		showLegend,
		showValue,
		...orderFields
	],
	dynamic: [
		aggregation,
		breakdown,
		dataKey,
		descriptor,
		group,
		source,
		sourceForCompute,
		type,
		xAxis,
		yAxis
	]
};

const summaryFields = {
	base: orderFields,
	dynamic: [
		aggregation,
		dataKey,
		descriptor,
		indicator,
		source,
		sourceForCompute
	]
};

const tableFields = {
	base: orderFields,
	dynamic: [
		aggregation,
		breakdown,
		calcTotalColumn,
		calcTotalRow,
		column,
		dataKey,
		descriptor,
		row,
		source,
		sourceForCompute
	]
};

const defaultFields = [
	diagramName,
	layout,
	name,
	showName,
	type
];

const filter = (data: FormData): any => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;
	const filteredData = {};
	const variants = {
		[BAR]: axisChartFields,
		[BAR_STACKED]: axisChartFields,
		[COLUMN]: axisChartFields,
		[COLUMN_STACKED]: axisChartFields,
		[COMBO]: compositeFields(data, comboFields),
		[DONUT]: circleChartFields,
		[LINE]: axisChartFields,
		[PIE]: circleChartFields,
		[SUMMARY]: compositeFields(data, summaryFields),
		[TABLE]: compositeFields(data, tableFields)
	};

	const variant = variants[data.type.value];
	const typeFields = typeof variant === 'object' ? variant : variant();

	[...defaultFields, ...typeFields].forEach(key => {
		filteredData[key] = data[key] || null;
	});

	return filteredData;
};

export default filter;
