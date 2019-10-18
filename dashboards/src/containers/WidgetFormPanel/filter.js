// @flow
import {CHART_VARIANTS} from 'utils/chart';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {FormData} from 'components/organisms/WidgetFormPanel/types';
import {createOrderName, WIDGET_VARIANTS} from 'utils/widget';

const {
	aggregation,
	breakdown,
	calcTotalColumn,
	calcTotalRow,
	chart,
	colors,
	column,
	computedAttrs,
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
	type,
	xAxis,
	yAxis
} = FIELDS;

const axisChartFields = {
	aggregation,
	breakdown,
	colors,
	descriptor,
	group,
	legendPosition,
	order,
	showLegend,
	showName,
	showValue,
	showXAxis,
	showYAxis,
	source,
	xAxis,
	yAxis
};

const circleChartFields = {
	aggregation,
	breakdown,
	chart,
	colors,
	descriptor,
	indicator,
	legendPosition,
	showLegend,
	showValue,
	source
};

const comboChartFields = (data: FormData) => {
	const fields = {
		colors,
		computedAttrs,
		legendPosition,
		order,
		showLegend,
		showValue
	};

	if (Array.isArray(data[order])) {
		data[order].forEach(num => {
			[aggregation, breakdown, chart, descriptor, group, source, xAxis, yAxis].forEach(baseName => {
				const name = createOrderName(num)(baseName);
				fields[name] = name;
			});
		});
	}

	return fields;
};

const summaryFields = {
	aggregation,
	descriptor,
	indicator,
	source
};

const tableFields = {
	aggregation,
	breakdown,
	calcTotalColumn,
	calcTotalRow,
	column,
	descriptor,
	row,
	source
};

const defaultFields = {
	diagramName,
	layout,
	name,
	showName,
	type
};

const filter = (data: FormData): any => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;
	const filteredData = {};
	const variants = {
		[BAR]: axisChartFields,
		[BAR_STACKED]: axisChartFields,
		[COLUMN]: axisChartFields,
		[COLUMN_STACKED]: axisChartFields,
		[COMBO]: comboChartFields(data),
		[DONUT]: circleChartFields,
		[LINE]: axisChartFields,
		[PIE]: circleChartFields,
		[SUMMARY]: summaryFields,
		[TABLE]: tableFields
	};

	const fields = {...defaultFields, ...variants[data.type.value]};

	Object.keys(fields).forEach(key => {
		filteredData[key] = data[key] || null;
	});

	return filteredData;
};

export default filter;
