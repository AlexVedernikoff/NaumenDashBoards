// @flow
import {
	aggregation as aggregationFilter,
	array,
	axisIndicator,
	axisParameter,
	chartSorting,
	colors,
	dataLabels,
	getMainDataSet,
	getOrdinalData,
	group,
	hasOrdinalFormat,
	header,
	legend,
	mixinBreakdown,
	object,
	string
} from './helpers';
import type {AxisWidget} from 'store/widgets/data/types';
import {FIELDS} from 'WidgetFormPanel';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import type {LegacyWidget} from './types';
import uuid from 'tiny-uuid';

const getDataFields = () => {
	const {
		aggregation,
		breakdown,
		breakdownGroup,
		dataKey,
		descriptor,
		group,
		source,
		sourceForCompute,
		xAxis,
		yAxis
	} = FIELDS;

	return {
		aggregation,
		breakdown,
		breakdownGroup,
		dataKey,
		descriptor,
		group,
		source,
		sourceForCompute,
		xAxis,
		yAxis
	};
};

const normalizeDataSet = (set: Object) => {
	const {dataKey, descriptor, group, source, xAxis} = set;
	let resultSet = {
		dataKey,
		descriptor,
		group: group || getDefaultSystemGroup(xAxis),
		source,
		sourceForCompute: true,
		xAxis
	};

	if (!set.sourceForCompute) {
		const {aggregation, yAxis} = set;
		resultSet = {
			...resultSet,
			aggregation: aggregationFilter(aggregation),
			sourceForCompute: false,
			yAxis
		};
		resultSet = mixinBreakdown(set, resultSet);
	}

	return resultSet;
};

const createData = (widget: Object, fields: Object) => {
	const {
		aggregation,
		breakdown,
		breakdownGroup,
		dataKey,
		descriptor,
		group: groupName,
		source,
		sourceForCompute,
		xAxis,
		yAxis
	} = fields;

	return {
		aggregation: aggregationFilter(widget[aggregation]),
		breakdown: object(widget[breakdown], null),
		breakdownGroup: widget[breakdown] ? group(widget[breakdownGroup]) : null,
		dataKey: string(widget[dataKey], uuid()),
		descriptor: string(widget[descriptor]),
		group: group(widget[groupName]),
		source: object(widget[source]),
		sourceForCompute: Boolean(widget[sourceForCompute]),
		xAxis: object(widget[xAxis]),
		yAxis: object(widget[yAxis])
	};
};

const axisNormalizer = (widget: LegacyWidget): AxisWidget => {
	const {id, layout, type} = widget;
	const dataFields = getDataFields();
	let {data} = widget;

	if (!data) {
		data = hasOrdinalFormat(widget)
			? getOrdinalData(widget, dataFields, createData)
			: [createData(widget, dataFields)];
	}

	const set = getMainDataSet(data);

	return {
		colors: colors(widget[FIELDS.colors]),
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data: data.map(normalizeDataSet),
		dataLabels: dataLabels(widget),
		header: header(widget),
		id,
		indicator: axisIndicator(widget, set[FIELDS.yAxis]),
		layout,
		legend: legend(widget),
		name: string(widget[FIELDS.name]),
		parameter: axisParameter(widget, set[FIELDS.xAxis]),
		sorting: chartSorting(widget),
		type
	};
};

export {
	normalizeDataSet
};

export default axisNormalizer;
