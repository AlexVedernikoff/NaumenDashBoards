// @flow
import {aggregation, array, getOrdinalData, group, header, object, string} from './helpers';
import {DEFAULT_TABLE_SETTINGS} from 'components/molecules/Table/constants';
import {FIELDS} from 'WidgetFormPanel';
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
	const dataFields = getDataFields();
	const {
		data = getOrdinalData(widget, dataFields, createData),
		id,
		layout,
		type
	} = widget;

	return {
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data,
		header: header(widget),
		id,
		layout,
		name: string(widget[FIELDS.name]),
		rowsWidth: array(widget[FIELDS.rowsWidth]),
		table: DEFAULT_TABLE_SETTINGS,
		type
	};
};

export default tableNormalizer;
