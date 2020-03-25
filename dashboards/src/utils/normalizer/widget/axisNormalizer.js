// @flow
import {aggregation, array, colors, getOrdinalData, group, hasOrdinalFormat, legendPosition, object, string} from './helpers';
import type {AxisWidget} from 'store/widgets/data/types';
import FIELDS from 'components/organisms/WidgetFormPanel/constants/fields';
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

const createData = (widget: Object, fields: Object) => {
	const {
		aggregation: aggregationName,
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
		aggregation: aggregation(widget[aggregationName]),
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
	const data = hasOrdinalFormat(widget)
		? getOrdinalData(widget, dataFields, createData)
		: [createData(widget, dataFields)];

	return {
		colors: colors(widget[FIELDS.colors]),
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data,
		diagramName: string(widget[FIELDS.diagramName]),
		id,
		layout,
		legendPosition: legendPosition(widget[FIELDS.legendPosition]),
		name: string(widget[FIELDS.name]),
		showLegend: Boolean(widget[FIELDS.showLegend]),
		showName: Boolean(widget[FIELDS.showName]),
		showValue: Boolean(widget[FIELDS.showValue]),
		showXAxis: Boolean(widget[FIELDS.showXAxis]),
		showYAxis: Boolean(widget[FIELDS.showYAxis]),
		type
	};
};

export default axisNormalizer;
