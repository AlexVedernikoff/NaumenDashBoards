// @flow
import {
	aggregation,
	array,
	chartSorting,
	colors,
	dataLabels,
	getOrdinalData,
	group,
	hasOrdinalFormat,
	header,
	legend,
	object,
	string
} from './helpers';
import type {CircleData, CircleWidget} from 'store/widgets/data/types';
import {FIELDS} from 'WidgetFormPanel';
import type {LegacyWidget} from './types';
import uuid from 'tiny-uuid';

const getDataFields = () => {
	const {aggregation, breakdown, breakdownGroup, dataKey, descriptor, indicator, source, sourceForCompute} = FIELDS;

	return {
		aggregation,
		breakdown,
		breakdownGroup,
		dataKey,
		descriptor,
		indicator,
		source,
		sourceForCompute
	};
};

const createData = (widget: Object, fields: Object): CircleData => {
	const {
		aggregation: aggregationName,
		breakdown,
		breakdownGroup,
		dataKey,
		descriptor,
		indicator,
		source,
		sourceForCompute
	} = fields;

	return {
		aggregation: aggregation(widget[aggregationName]),
		breakdown: object(widget[breakdown]),
		breakdownGroup: group(widget[breakdownGroup]),
		dataKey: string(widget[dataKey], uuid()),
		descriptor: string(widget[descriptor]),
		indicator: object(widget[indicator]),
		source: object(widget[source]),
		sourceForCompute: Boolean(widget[sourceForCompute])
	};
};

const circleNormalizer = (widget: LegacyWidget): CircleWidget => {
	const {id, layout, type} = widget;
	const dataFields = getDataFields();
	let {data} = widget;

	if (!data) {
		data = hasOrdinalFormat(widget) ? getOrdinalData(widget, dataFields, createData) : [createData(widget, dataFields)];
	}

	return {
		colors: colors(widget[FIELDS.colors]),
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data,
		dataLabels: dataLabels(widget),
		header: header(widget),
		id,
		layout,
		legend: legend(widget),
		name: string(widget[FIELDS.name]),
		sorting: chartSorting(widget, true),
		type
	};
};

export default circleNormalizer;
