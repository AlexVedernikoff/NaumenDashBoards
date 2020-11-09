// @flow
import {
	aggregation as aggregationFilter,
	array,
	axisIndicator,
	axisParameter,
	breakdown,
	chartSorting,
	colors,
	dataLabels,
	getMainDataSet,
	getOrdinalData,
	group,
	header,
	legend,
	mixinBreakdown,
	object,
	string,
	templateName
} from './helpers';
import type {ComboData, ComboWidget} from 'store/widgets/data/types';
import {COMBO_TYPES, DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import {DEFAULT_COMBO_Y_AXIS_SETTINGS} from 'utils/chart/constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import type {LegacyWidget} from './types';
import uuid from 'tiny-uuid';

const type = (type: any) => {
	let resultType = type;

	if (resultType && typeof resultType === 'object') {
		resultType = resultType.value;
	}

	return resultType && resultType in COMBO_TYPES ? resultType : COMBO_TYPES.COLUMN;
};

const normalizeDataSet = (set: Object, index: number, data: Array<Object>): ComboData => {
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
		const {aggregation, showEmptyData, type = WIDGET_TYPES.COLUMN, yAxis} = set;
		resultSet = {
			...resultSet,
			aggregation: aggregationFilter(aggregation),
			showEmptyData: !!showEmptyData,
			sourceForCompute: false,
			type,
			yAxis
		};
		resultSet = mixinBreakdown({...set, breakdown: breakdown(index, data, FIELDS.yAxis)}, resultSet);
	}

	return resultSet;
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
		type: typeName,
		xAxis,
		yAxis
	} = fields;

	return {
		aggregation: aggregationFilter(widget[aggregation]),
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
		displayMode = DISPLAY_MODE.WEB,
		id,
		indicatorSettings = DEFAULT_COMBO_Y_AXIS_SETTINGS,
		showEmptyData,
		type
	} = widget;
	const set = getMainDataSet(data);

	return {
		colors: colors(widget[FIELDS.colors]),
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data: data.map(normalizeDataSet),
		dataLabels: dataLabels(widget),
		displayMode,
		header: header(widget),
		id,
		indicator: axisIndicator(widget, set[FIELDS.yAxis]),
		indicatorSettings,
		legend: legend(widget),
		name: string(widget[FIELDS.name]),
		parameter: axisParameter(widget, set[FIELDS.xAxis]),
		showEmptyData: Boolean(showEmptyData),
		sorting: chartSorting(widget),
		templateName: templateName(widget),
		type
	};
};

export {
	normalizeDataSet
};

export default comboNormalizer;
