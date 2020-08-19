// @flow
import {
	aggregation as aggregationFilter,
	array,
	getOrdinalData,
	header,
	object,
	string
} from './helpers';
import {DEFAULT_SUMMARY_SETTINGS} from 'components/molecules/Summary/constants';
import {DISPLAY_MODE} from 'store/widgets/data/constants';
import {FIELDS} from 'WidgetFormPanel';
import type {LegacyWidget} from './types';
import type {SummaryData, SummaryWidget} from 'store/widgets/data/types';
import uuid from 'tiny-uuid';

const getDataFields = () => {
	const {aggregation, dataKey, descriptor, indicator, source, sourceForCompute} = FIELDS;

	return {
		aggregation,
		dataKey,
		descriptor,
		indicator,
		source,
		sourceForCompute
	};
};

const normalizeDataSet = (set: Object): SummaryData => {
	const {dataKey, descriptor, source} = set;
	let resultSet = {
		dataKey,
		descriptor,
		source,
		sourceForCompute: true
	};

	if (!set.sourceForCompute) {
		const {aggregation, indicator} = set;
		resultSet = {
			...resultSet,
			aggregation: aggregationFilter(aggregation),
			indicator,
			sourceForCompute: false
		};
	}

	return resultSet;
};

const createData = (widget: Object, fields: Object) => {
	const {aggregation, dataKey, descriptor, indicator, source, sourceForCompute} = fields;

	return {
		aggregation: aggregationFilter(widget[aggregation]),
		dataKey: string(widget[dataKey], uuid()),
		descriptor: string(widget[descriptor]),
		indicator: object(widget[indicator]),
		source: object(widget[source]),
		sourceForCompute: Boolean(widget[sourceForCompute])
	};
};

const summaryNormalizer = (widget: LegacyWidget): SummaryWidget => {
	const dataFields = getDataFields();
	const {
		id,
		data = getOrdinalData(widget, dataFields, createData),
		displayMode = DISPLAY_MODE.WEB,
		indicator = DEFAULT_SUMMARY_SETTINGS.indicator,
		type
	} = widget;

	return {
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data: data.map(normalizeDataSet),
		displayMode,
		header: header(widget),
		id,
		indicator,
		name: string(widget[FIELDS.name]),
		type
	};
};

export {
	normalizeDataSet
};

export default summaryNormalizer;
