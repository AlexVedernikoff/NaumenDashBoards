// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	COMBO_TYPES,
	FONT_STYLES,
	SORTING_TYPES,
	SORTING_VALUES,
	TEXT_ALIGNS,
	TEXT_HANDLERS,
	WIDGET_SETS,
	WIDGET_TYPES,
	WIDGETS_EVENTS
} from './constants';
import {GROUP_WAYS} from 'store/widgets/constants';
import type {Layout, LayoutItem} from 'utils/layout/types';
import {LEGEND_POSITIONS} from 'utils/chart';
import type {NewWidget} from 'entities';

type FontStyle = $Keys<typeof FONT_STYLES>;

type TextAlign = $Keys<typeof TEXT_ALIGNS>;

type TextHandler = $Keys<typeof TEXT_HANDLERS>;

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

// Общие параметры всех виджетов

type BaseData = {
	dataKey: string,
	descriptor: string,
	source: Source,
	sourceForCompute: boolean,
};

export type Header = {
	fontColor: string,
	fontFamily: string,
	fontSize: number,
	fontStyle?: FontStyle,
	name: string,
	show: boolean,
	textAlign: TextAlign,
	textHandler: TextHandler
};

type BaseWidget = {|
	computedAttrs: Array<ComputedAttr>,
	header: Header,
	id: string,
	layout: LayoutItem,
	name: string
|};

// Общие параметры графиков

type LegendPosition = $Keys<typeof LEGEND_POSITIONS>;

export type Legend = {
	fontFamily: string,
	fontSize: number,
	position: LegendPosition,
	show: boolean,
	textHandler: TextHandler
};

export type ChartSorting = {
	type: $Keys<typeof SORTING_TYPES>,
	value: $Keys<typeof SORTING_VALUES>
};

export type DataLabels = {
	fontColor: string,
	fontFamily: string,
	fontSize: number,
	show: boolean,
	showShadow: boolean
};

// График с осями

export type AxisIndicator = {
	max?: number,
	min?: number,
	name: string,
	show: boolean,
	showName: boolean,
	tickAmount?: number
};

export type AxisParameter = {
	name: string,
	show: boolean,
	showName: boolean
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

export type AxisWidget = {
	...BaseWidget,
	colors: Array<string>,
	data: Array<AxisData>,
	dataLabels: DataLabels,
	indicator: AxisIndicator,
	legend: Legend,
	parameter: AxisParameter,
	sorting: ChartSorting,
	type: $Keys<typeof WIDGET_SETS.AXIS>
};

// Круговой график

export type CircleData = {
	...BaseData,
	aggregation: string,
	breakdown: Attribute,
	breakdownGroup: Group,
	indicator: MixedAttribute
};

export type CircleWidget = {
	...BaseWidget,
	colors: Array<string>,
	data: Array<CircleData>,
	dataLabels: DataLabels,
	legend: Legend,
	sorting: ChartSorting,
	type: $Keys<typeof WIDGET_SETS.CIRCLE>
};

// Комбо график

type ComboType = $Keys<typeof COMBO_TYPES>;

export type ComboData = {
	...AxisData,
	type: ComboType
};

export type ComboWidget = {
	...BaseWidget,
	colors: Array<string>,
	data: Array<ComboData>,
	dataLabels: DataLabels,
	indicator: AxisIndicator,
	legend: Legend,
	parameter: AxisParameter,
	sorting: ChartSorting,
	type: typeof WIDGET_TYPES.COMBO,
};

// Сводка

export type SummaryData = {
	...BaseData,
	aggregation: string,
	indicator: MixedAttribute
};

export type SummaryIndicator = {
	fontColor: string,
	fontFamily: string,
	fontSize: number,
	fontStyle?: FontStyle
};

export type SummaryWidget = {
	...BaseWidget,
	data: Array<SummaryData>,
	indicator: SummaryIndicator,
	type: typeof WIDGET_TYPES.SUMMARY
};

// Таблица

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

export type Table = {
	body: {
		emptyData: Object,
		showRowNum: boolean,
		textAlign: TextAlign,
		textHandler: TextHandler
	},
	columnHeader: {
		fontColor: string,
		fontStyle?: FontStyle
	},
	rowHeader: {
		fontColor: string,
		fontStyle?: FontStyle
	}
};

export type TableWidget = {
	...BaseWidget,
	data: Array<TableData>,
	rowsWidth: Array<number>,
	table: Table,
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
