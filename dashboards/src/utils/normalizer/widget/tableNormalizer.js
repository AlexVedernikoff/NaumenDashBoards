// @flow
import {aggregation, array, getOrdinalData, group, object, string} from './helpers';
import FIELDS from 'components/organisms/WidgetFormPanel/constants/fields';
import type {LegacyWidget} from './types';
import type {TableData, TableWidget} from 'store/widgets/data/types';
import uuid from 'tiny-uuid';

const getDataFields = () => {
	const {
		aggregation,
		breakdown,
		breakdownGroup,
		calcTotalColumn,
		calcTotalRow,
		column,
		dataKey,
		descriptor,
		row,
		source,
		sourceForCompute
	} = FIELDS;

	return {
		aggregation,
		breakdown,
		breakdownGroup,
		calcTotalColumn,
		calcTotalRow,
		column,
		dataKey,
		descriptor,
		row,
		source,
		sourceForCompute
	};
};

const createData = (widget: Object, fields: Object): TableData => {
	const {
		aggregation: aggregationName,
		breakdown,
		breakdownGroup,
		calcTotalColumn,
		calcTotalRow,
		column,
		dataKey,
		descriptor,
		row,
		source,
		sourceForCompute
	} = fields;

	return {
		aggregation: aggregation(widget[aggregationName]),
		breakdown: object(widget[breakdown]),
		breakdownGroup: group(widget[breakdownGroup]),
		calcTotalColumn: Boolean(widget[calcTotalColumn]),
		calcTotalRow: Boolean(widget[calcTotalRow]),
		column: object(widget[column]),
		dataKey: string(widget[dataKey], uuid()),
		descriptor: string(widget[descriptor]),
		row: object(widget[row]),
		source: object(widget[source]),
		sourceForCompute: Boolean(widget[sourceForCompute])
	};
};

const tableNormalizer = (widget: LegacyWidget): TableWidget => {
	const {id, layout, type} = widget;
	const dataFields = getDataFields();

	return {
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data: getOrdinalData(widget, dataFields, createData),
		diagramName: string(widget[FIELDS.diagramName]),
		id,
		layout,
		name: string(widget[FIELDS.name]),
		rowsWidth: array(widget[FIELDS.rowsWidth]),
		showName: Boolean(widget[FIELDS.showName]),
		type
	};
};

export default tableNormalizer;
