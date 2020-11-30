// @flow
import {
	aggregation as aggregationFilter,
	array,
	getOrdinalData,
	group,
	header,
	object,
	string,
	templateName
} from './helpers';
import {DEFAULT_NAVIGATION_SETTINGS, DISPLAY_MODE} from 'store/widgets/data/constants';
import {DEFAULT_TABLE_SETTINGS, DEFAULT_TABLE_SORTING} from 'components/organisms/Table/constants';
import {extend, isObject} from 'src/helpers';
import {FIELDS} from 'DiagramWidgetEditForm';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
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

const normalizeDataSet = (set: Object, index: number, data: Array<Object>): TableData => {
	const {dataKey, descriptor, indicators, parameters, row, source, sourceForCompute} = set;
	let resultSet = {
		dataKey,
		descriptor,
		parameters: parameters || [{attribute: row, group: getDefaultSystemGroup(row)}],
		source,
		sourceForCompute
	};

	if (!set.sourceForCompute) {
		const {aggregation, breakdown, breakdownGroup, column} = set;
		resultSet = {
			...resultSet,
			breakdown,
			breakdownGroup,
			indicators: indicators || [{aggregation: aggregationFilter(aggregation), attribute: column}]
		};
	}

	return resultSet;
};

const createData = (widget: Object, fields: Object) => {
	const {
		aggregation,
		breakdown,
		breakdownGroup,
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
		displayMode = DISPLAY_MODE.WEB,
		id,
		navigation = DEFAULT_NAVIGATION_SETTINGS,
		showEmptyData = true,
		sorting = DEFAULT_TABLE_SORTING,
		table,
		type
	} = widget;

	return {
		calcTotalColumn,
		calcTotalRow,
		columnsRatioWidth: isObject(widget[FIELDS.columnsRatioWidth]) ? widget[FIELDS.columnsRatioWidth] : {},
		computedAttrs: array(widget[FIELDS.computedAttrs]),
		data: data.map(normalizeDataSet),
		displayMode,
		header: header(widget),
		id,
		name: string(widget[FIELDS.name]),
		navigation,
		showEmptyData,
		sorting,
		table: extend(DEFAULT_TABLE_SETTINGS, table),
		templateName: templateName(widget),
		type
	};
};

export {
	normalizeDataSet
};

export default tableNormalizer;
