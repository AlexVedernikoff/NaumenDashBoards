// @flow
import {aggregation, array, getOrdinalData, header, object, string} from './helpers';
import {DEFAULT_SUMMARY_SETTINGS} from 'components/molecules/Summary/constants';
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

const createData = (widget: Object, fields: Object): SummaryData => {
	const {aggregation: aggregationName, dataKey, descriptor, indicator, source, sourceForCompute} = fields;

	return {
		aggregation: aggregation(widget[aggregationName]),
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
		indicator = DEFAULT_SUMMARY_SETTINGS.indicator,
		layout,
		type
	} = widget;

	return {
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data,
		header: header(widget),
		id,
		indicator,
		layout,
		name: string(widget[FIELDS.name]),
		type
	};
};

export default summaryNormalizer;
