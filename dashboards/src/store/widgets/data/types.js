// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {COMBO_TYPES, WIDGET_SETS, WIDGET_TYPES, WIDGETS_EVENTS} from './constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import type {Layout, LayoutItem} from 'utils/layout/types';
import {LEGEND_POSITIONS} from 'utils/chart';
import type {NewWidget} from 'entities';

type LegendPosition = $Keys<typeof LEGEND_POSITIONS>;

type ComputeData = {
	aggregation: string,
	attr: Attribute,
	dataKey: string
};

type ComputeDataMap = {
	[string]: ComputeData
};

export type ComputedAttr = {|
	code: string,
	computeData: ComputeDataMap,
	state: string,
	stringForCompute: string,
	title: string,
	type: typeof ATTRIBUTE_TYPES.COMPUTED_ATTR
|};

export type MixedAttribute = ComputedAttr | Attribute;

export type GroupType = string;

export type GroupWay = $Keys<typeof GROUP_WAYS>;

export type WidgetType = $Keys<typeof WIDGET_TYPES>;

export type Source = {
	label: string,
	value: string
};

export type Group = {
	data: string,
	way: GroupWay
};

type BaseData = {
	dataKey: string,
	descriptor: string,
	source: Source,
	sourceForCompute: boolean,
};

export type AxisData = {
	...BaseData,
	aggregation: string,
	breakdown: Attribute | null,
	breakdownGroup: Group | null,
	group: Group,
	xAxis: Attribute,
	yAxis: MixedAttribute
};

type ComboType = $Keys<typeof COMBO_TYPES>;

export type ComboData = {
	...AxisData,
	type: ComboType
};

export type CircleData = {
	...BaseData,
	aggregation: string,
	breakdown: Attribute,
	breakdownGroup: Group,
	indicator: MixedAttribute
};

export type SummaryData = {
	...BaseData,
	aggregation: string,
	indicator: MixedAttribute
};

export type TableData = {
	...BaseData,
	aggregation: string,
	breakdown: Attribute,
	breakdownGroup: Group,
	calcTotalColumn: boolean,
	calcTotalRow: boolean,
	column: MixedAttribute,
	row: Attribute
};

type BaseWidget = {|
	computedAttrs: Array<ComputedAttr>,
	diagramName: string,
	id: string,
	layout: LayoutItem,
	name: string,
|};

export type AxisWidget = {
	...BaseWidget,
	colors: Array<string>,
	data: Array<AxisData>,
	legendPosition: LegendPosition,
	showLegend: boolean;
	showName: boolean,
	showValue: boolean,
	showXAxis: boolean,
	showYAxis: boolean,
	type: $Keys<typeof WIDGET_SETS.AXIS>,
};

export type CircleWidget = {
	...BaseWidget,
	colors: Array<string>,
	data: Array<CircleData>,
	legendPosition: LegendPosition,
	showLegend: boolean;
	showName: boolean,
	showValue: boolean,
	type: $Keys<typeof WIDGET_SETS.CIRCLE>
};

export type ComboWidget = {
	...BaseWidget,
	colors: Array<string>,
	data: Array<ComboData>,
	legendPosition: LegendPosition,
	showLegend: boolean;
	showName: boolean,
	showValue: boolean,
	type: typeof WIDGET_TYPES.COMBO,
};

export type SummaryWidget = {
	...BaseWidget,
	data: Array<SummaryData>,
	showName: boolean,
	type: typeof WIDGET_TYPES.SUMMARY
};

export type TableWidget = {
	...BaseWidget,
	data: Array<TableData>,
	rowsWidth: Array<number>,
	showName: boolean,
	type: typeof WIDGET_TYPES.TABLE
};

export type Chart =
	| AxisWidget
	| CircleWidget
	| ComboWidget
;

export type Widget =
	| Chart
	| SummaryWidget
	| TableWidget
;

export type AddWidget = {
	type: typeof WIDGETS_EVENTS.ADD_WIDGET,
	payload: NewWidget
};

export type UpdateWidget = {
	type: typeof WIDGETS_EVENTS.UPDATE_WIDGET,
	payload: Widget
};

export type SetCreatedWidget = {
	type: typeof WIDGETS_EVENTS.SET_CREATED_WIDGET,
	payload: Widget
};

export type DeleteWidget = {
	type: typeof WIDGETS_EVENTS.DELETE_WIDGET,
	payload: string
};

export type EditLayout = {
	type: typeof WIDGETS_EVENTS.EDIT_LAYOUT,
	payload: Layout
};

export type SelectWidget = {
	type: typeof WIDGETS_EVENTS.SET_SELECTED_WIDGET,
	payload: string
};

export type ResetWidget = {
	type: typeof WIDGETS_EVENTS.RESET_WIDGET,
};

export type RecordWidgetSaveError = {
	type: typeof WIDGETS_EVENTS.RECORD_WIDGET_SAVE_ERROR,
};

export type RecordLayoutSaveError = {
	type: typeof WIDGETS_EVENTS.RECORD_LAYOUT_SAVE_ERROR,
};

export type RequestLayoutSave = {
	type: typeof WIDGETS_EVENTS.REQUEST_LAYOUT_SAVE,
};

export type RequestWidgetDelete = {
	type: typeof WIDGETS_EVENTS.REQUEST_WIDGET_DELETE,
};

export type RequestWidgetSave = {
	type: typeof WIDGETS_EVENTS.REQUEST_WIDGET_SAVE,
};

export type RecordWidgetDeleteError = {
	type: typeof WIDGETS_EVENTS.RECORD_WIDGET_DELETE_ERROR
};

export type SetWidgets = {
	type: typeof WIDGETS_EVENTS.SET_WIDGETS,
	payload: Array<Widget>
};

type UnknownWidgetsAction = {
	type: typeof WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION,
	payload: null
};

export type WidgetsAction =
	| AddWidget
	| DeleteWidget
	| EditLayout
	| RecordLayoutSaveError
	| RecordWidgetDeleteError
	| RecordWidgetSaveError
	| RequestLayoutSave
	| RequestWidgetDelete
	| RequestWidgetSave
	| ResetWidget
	| SelectWidget
	| SetCreatedWidget
	| SetWidgets
	| UpdateWidget
	| UnknownWidgetsAction
;

export type WidgetMap = {
	[key: string]: Widget;
};

export type WidgetsDataState = {
	deleteError: boolean,
	deleting: boolean,
	error: boolean,
	layoutSaveError: boolean,
	loading: boolean,
	map: WidgetMap,
	newWidget: NewWidget | null,
	saveError: boolean,
	selectedWidget: string,
	updating: boolean
};
