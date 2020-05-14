// @flow
import {
	aggregation as aggregationFilter,
	array,
	getOrdinalData,
	group,
	header,
	mixinBreakdown,
	object,
	string
} from './helpers';
import {DEFAULT_TABLE_SETTINGS, DEFAULT_TABLE_SORTING} from 'components/organisms/Table/constants';
import {extend} from 'src/helpers';
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

const normalizeDataSet = (set: Object): TableData => {
	const {dataKey, descriptor, row, source} = set;
	let resultSet = {
		dataKey,
		descriptor,
		row,
		source,
		sourceForCompute: true
	};

	if (!set.sourceForCompute) {
		const {aggregation, column} = set;
		resultSet = {
			...resultSet,
			aggregation: aggregationFilter(aggregation),
			column,
			sourceForCompute: false
		};
		resultSet = mixinBreakdown(set, resultSet);
	}

	return resultSet;
};

const createData = (widget: Object, fields: Object) => {
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
	} = fields;

	return {
		aggregation: aggregationFilter(widget[aggregation]),
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
		calcTotalColumn = false,
		calcTotalRow = false,
		data = getOrdinalData(widget, dataFields, createData),
		id,
		layout,
		sorting = DEFAULT_TABLE_SORTING,
		table,
		type
	} = widget;

	return {
		calcTotalColumn,
		calcTotalRow,
		columnsRatioWidth: array(widget[FIELDS.columnsRatioWidth]),
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data: data.map(normalizeDataSet),
		header: header(widget),
		id,
		layout,
		name: string(widget[FIELDS.name]),
		sorting,
		table: extend(DEFAULT_TABLE_SETTINGS, table),
		type
	};
};

export {
	normalizeDataSet
};

export default tableNormalizer;
