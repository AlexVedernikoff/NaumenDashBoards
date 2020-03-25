// @flow
import {aggregation, array, getOrdinalData, object, string} from './helpers';
import FIELDS from 'components/organisms/WidgetFormPanel/constants/fields';
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
	const {id, layout, type} = widget;
	const dataFields = getDataFields();

	return {
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data: getOrdinalData(widget, dataFields, createData),
		diagramName: string(widget[FIELDS.diagramName]),
		id,
		layout,
		name: string(widget[FIELDS.name]),
		showName: Boolean(widget[FIELDS.showName]),
		type
	};
};

export default summaryNormalizer;
