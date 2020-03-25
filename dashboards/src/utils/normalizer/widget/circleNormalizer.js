// @flow
import {aggregation, array, colors, getOrdinalData, group, hasOrdinalFormat, legendPosition, object, string} from './helpers';
import type {CircleData, CircleWidget} from 'store/widgets/data/types';
import FIELDS from 'components/organisms/WidgetFormPanel/constants/fields';
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
		type
	};
};

export default circleNormalizer;
