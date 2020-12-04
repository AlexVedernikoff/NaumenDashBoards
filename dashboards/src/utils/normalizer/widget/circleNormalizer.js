// @flow
import {
	aggregation as aggregationFilter,
	array,
	breakdown,
	chartSorting,
	colors,
	dataLabels,
	getOrdinalData,
	group,
	hasOrdinalFormat,
	header,
	legend,
	mixinBreakdown,
	object,
	string,
	templateName
} from './helpers';
import type {CircleData, CircleWidget} from 'store/widgets/data/types';
import {DEFAULT_NAVIGATION_SETTINGS, DEFAULT_TOP_SETTINGS, DISPLAY_MODE} from 'store/widgets/data/constants';
import {FIELDS} from 'DiagramWidgetEditForm';
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

const normalizeDataSet = (set: Object, index: number, data: Array<Object>): CircleData => {
	const {dataKey, descriptor, source} = set;
	let resultSet = {
		dataKey,
		descriptor,
		source,
		sourceForCompute: true
	};

	if (!set.sourceForCompute) {
		const {aggregation, indicator, showEmptyData, top = DEFAULT_TOP_SETTINGS} = set;
		resultSet = {
			...set,
			aggregation: aggregationFilter(aggregation),
			indicator,
			showEmptyData: !!showEmptyData,
			sourceForCompute: false,
			top
		};
		resultSet = mixinBreakdown({...set, breakdown: breakdown(index, data)}, resultSet);
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
		indicator,
		source,
		sourceForCompute
	} = fields;

	return {
		aggregation: aggregationFilter(widget[aggregation]),
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
	const {displayMode = DISPLAY_MODE.WEB, id, navigation = DEFAULT_NAVIGATION_SETTINGS, type} = widget;
	const dataFields = getDataFields();
	let {data} = widget;

	if (!data) {
		data = hasOrdinalFormat(widget) ? getOrdinalData(widget, dataFields, createData) : [createData(widget, dataFields)];
	}

	return {
		colors: colors(widget[FIELDS.colors]),
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data: data.map(normalizeDataSet),
		dataLabels: dataLabels(widget),
		displayMode,
		header: header(widget),
		id,
		legend: legend(widget),
		name: string(widget[FIELDS.name]),
		navigation,
		sorting: chartSorting(widget, true),
		templateName: templateName(widget),
		type
	};
};

export {
	normalizeDataSet
};

export default circleNormalizer;
