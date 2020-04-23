// @flow
import {
	aggregation,
	array,
	axisIndicator,
	axisParameter,
	chartSorting,
	colors,
	dataLabels,
	getMainDataSet,
	getOrdinalData,
	group,
	header,
	legend,
	object,
	string
} from './helpers';
import type {ComboData, ComboWidget} from 'store/widgets/data/types';
import {COMBO_TYPES} from 'store/widgets/data/constants';
import {FIELDS} from 'WidgetFormPanel';
import type {LegacyWidget} from './types';
import uuid from 'tiny-uuid';

const type = (type: any) => {
	if (type && typeof type === 'object') {
		type = type.value;
	}

	return type && type in COMBO_TYPES ? type : COMBO_TYPES.COLUMN;
};

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
		type,
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
		type,
		xAxis,
		yAxis
	};
};

const createData = (widget: Object, fields: Object): ComboData => {
	const {
		aggregation: aggregationName,
		breakdown,
		breakdownGroup,
		dataKey,
		descriptor,
		group: groupName,
		source,
		sourceForCompute,
		type: typeName,
		xAxis,
		yAxis
	} = fields;

	return {
		aggregation: aggregation(widget[aggregationName]),
		breakdown: object(widget[breakdown], null),
		breakdownGroup: widget[breakdown] ? group(widget[breakdownGroup]) : null,
		dataKey: string(widget[dataKey], uuid()),
		descriptor: string(widget[descriptor], ''),
		group: group(widget[groupName]),
		source: object(widget[source]),
		sourceForCompute: Boolean(widget[sourceForCompute]),
		type: type(widget[typeName]),
		xAxis: object(widget[xAxis]),
		yAxis: object(widget[yAxis])
	};
};

const comboNormalizer = (widget: LegacyWidget): ComboWidget => {
	const dataFields = getDataFields();
	const {
		data = getOrdinalData(widget, dataFields, createData),
		id,
		layout,
		type
	} = widget;
	const set = getMainDataSet(data);

	return {
		colors: colors(widget[FIELDS.colors]),
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data,
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

export default comboNormalizer;
