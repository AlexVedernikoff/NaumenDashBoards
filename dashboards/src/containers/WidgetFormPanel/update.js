// @flow
import type {
	AxisData,
	AxisWidget,
	CircleData,
	CircleWidget,
	ComboData,
	ComboWidget,
	SummaryData,
	SummaryWidget,
	TableData,
	TableWidget,
	Widget
} from 'store/widgets/data/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_COLORS, LEGEND_POSITIONS} from 'utils/chart/constants';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import uuid from 'tiny-uuid';
import type {Values} from './types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const updateAxisData = (set: Values): AxisData => {
	const {
		aggregation = DEFAULT_AGGREGATION.COUNT,
		breakdown = null,
		breakdownGroup = null,
		group = getDefaultSystemGroup(set.xAxis),
		descriptor = '',
		dataKey = uuid(),
		source,
		sourceForCompute = false,
		xAxis,
		yAxis
	} = set;

	return {
		aggregation,
		breakdown,
		breakdownGroup,
		dataKey,
		descriptor,
		group,
		source,
		sourceForCompute,
		xAxis,
		yAxis
	};
};

const updateAxisWidget = (widget: Widget, values: Values): AxisWidget => {
	const {id, layout} = widget;
	const {
		colors = DEFAULT_COLORS,
		computedAttrs = [],
		data = [],
		diagramName = '',
		legendPosition = LEGEND_POSITIONS.bottom,
		name = '',
		showLegend = false,
		showName = true,
		showValue = false,
		showXAxis = false,
		showYAxis = false,
		type
	} = values;

	return {
		colors,
		computedAttrs,
		data: data.map(updateAxisData),
		diagramName,
		id,
		layout,
		legendPosition,
		name,
		showLegend,
		showName,
		showValue,
		showXAxis,
		showYAxis,
		type
	};
};

const updateCircleData = (set: Values): CircleData => {
	const {
		aggregation = DEFAULT_AGGREGATION.COUNT,
		breakdown,
		breakdownGroup,
		descriptor = '',
		dataKey = uuid(),
		indicator,
		source,
		sourceForCompute = false
	} = set;

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

const updateCircleWidget = (widget: Widget, values: Values): CircleWidget => {
	const {id, layout} = widget;
	const {
		colors = DEFAULT_COLORS,
		computedAttrs = [],
		data = [],
		diagramName = '',
		legendPosition = LEGEND_POSITIONS.bottom,
		name = '',
		showLegend = false,
		showName = true,
		showValue = false,
		type
	} = values;

	return {
		colors,
		computedAttrs,
		data: data.map(updateCircleData),
		diagramName,
		id,
		layout,
		legendPosition,
		name,
		showLegend,
		showName,
		showValue,
		type
	};
};

const updateComboData = (set: Values): ComboData => {
	const {
		aggregation = DEFAULT_AGGREGATION.COUNT,
		breakdown = null,
		breakdownGroup = null,
		group = getDefaultSystemGroup(set.xAxis),
		descriptor = '',
		dataKey = uuid(),
		source,
		sourceForCompute = false,
		type = WIDGET_TYPES.COLUMN,
		xAxis,
		yAxis
	} = set;

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

const updateComboWidget = (widget: Widget, values: Values): ComboWidget => {
	const {id, layout} = widget;
	const {
		colors = DEFAULT_COLORS,
		computedAttrs = [],
		data = [],
		diagramName = '',
		legendPosition = LEGEND_POSITIONS.bottom,
		name = '',
		showLegend = false,
		showName = true,
		showValue = false,
		showXAxis = false,
		showYAxis = false,
		type
	} = values;

	return {
		colors,
		computedAttrs,
		data: data.map(updateComboData),
		diagramName,
		id,
		layout,
		legendPosition,
		name,
		showLegend,
		showName,
		showValue,
		showXAxis,
		showYAxis,
		type
	};
};

const updateSummaryData = (set: Values): SummaryData => {
	const {
		aggregation = DEFAULT_AGGREGATION.COUNT,
		descriptor = '',
		dataKey = uuid(),
		indicator,
		source,
		sourceForCompute = false
	} = set;

	return {
		aggregation,
		dataKey,
		descriptor,
		indicator,
		source,
		sourceForCompute
	};
};

const updateSummaryWidget = (widget: Widget, values: Values): SummaryWidget => {
	const {id, layout} = widget;
	const {
		computedAttrs = [],
		data = [],
		diagramName = '',
		name = '',
		showName = true,
		type
	} = values;

	return {
		computedAttrs,
		data: data.map(updateSummaryData),
		diagramName,
		id,
		layout,
		name,
		showName,
		type
	};
};

const updateTableData = (set: Values): TableData => {
	const {
		aggregation = DEFAULT_AGGREGATION.COUNT,
		breakdown,
		breakdownGroup,
		calcTotalColumn = false,
		calcTotalRow = false,
		column,
		descriptor = '',
		dataKey = uuid(),
		row,
		source,
		sourceForCompute = false
	} = set;

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

const updateTableWidget = (widget: Widget, values: Values): TableWidget => {
	const {id, layout} = widget;
	const rowsWidth = widget.type === WIDGET_TYPES.TABLE ? widget.rowsWidth : [];
	const {
		computedAttrs = [],
		data = [],
		diagramName = '',
		name = '',
		showName = true,
		type
	} = values;

	return {
		computedAttrs,
		data: data.map(updateTableData),
		diagramName,
		id,
		layout,
		name,
		rowsWidth,
		showName,
		type
	};
};

const resolve = (widget: Widget, values: Object) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SUMMARY, TABLE} = WIDGET_TYPES;

	switch (values.type) {
		case BAR:
		case BAR_STACKED:
		case COLUMN:
		case COLUMN_STACKED:
		case LINE:
			return updateAxisWidget(widget, values);
		case COMBO:
			return updateComboWidget(widget, values);
		case DONUT:
		case PIE:
			return updateCircleWidget(widget, values);
		case SUMMARY:
			return updateSummaryWidget(widget, values);
		case TABLE:
			return updateTableWidget(widget, values);
		default:
			return widget;
	}
};

const update = (widget: Widget, values: Values) => resolve(widget, values);

export default update;
