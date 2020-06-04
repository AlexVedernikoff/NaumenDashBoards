// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	COMBO_TYPES,
	DEFAULT_TABLE_VALUE,
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

export type FontStyle = $Keys<typeof FONT_STYLES>;

export type TextAlign = $Keys<typeof TEXT_ALIGNS>;

export type TextHandler = $Keys<typeof TEXT_HANDLERS>;

export type SortingType = $Keys<typeof SORTING_TYPES>;

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

export type ComputeData = {
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

export type ComputedBreakdown = Array<{
	dataKey: string,
	group: Group | null,
	value: Attribute | null
}>;

// Общие параметры всех виджетов

type BaseData = {
	dataKey: string,
	descriptor: string,
	source: Source
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
	name: string,
	show: boolean,
	showName: boolean
};

export type AxisParameter = {
	name: string,
	show: boolean,
	showName: boolean
};

export type ComputeAxisData = {
	...BaseData,
	group: Group,
	sourceForCompute: true,
	xAxis: Attribute,
};

export type BuildAxisData = {
	...BaseData,
	aggregation: string,
	breakdown?: Attribute | ComputedBreakdown,
	breakdownGroup?: Group,
	group: Group,
	sourceForCompute: false,
	xAxis: Attribute,
	yAxis: MixedAttribute
};

export type AxisData = ComputeAxisData | BuildAxisData;

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

export type BuildCircleData = {
	...BaseData,
	aggregation: string,
	breakdown: Attribute | ComputedBreakdown,
	breakdownGroup: Group,
	indicator: MixedAttribute,
	sourceForCompute: false
};

type ComputeCircleData = {
	...BaseData,
	sourceForCompute: true
};

export type CircleData = BuildCircleData | ComputeCircleData;

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

export type BuildComboData = {
	...BuildAxisData,
	type: ComboType
};

export type ComboData = ComputeAxisData | BuildComboData;

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

type BuildSummaryData = {
	...BaseData,
	aggregation: string,
	indicator: MixedAttribute,
	sourceForCompute: false
};

type ComputeSummaryData = {
	...BaseData,
	sourceForCompute: true
};

export type SummaryData = BuildSummaryData | ComputeSummaryData;

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

export type DefaultTableValue = $Keys<typeof DEFAULT_TABLE_VALUE>;

export type TableSorting = {
	column: number | null,
	type: SortingType
};

export type TableColumnHeader = {
	fontColor: string,
	fontStyle?: FontStyle
};

type BuildTableData = {
	...BaseData,
	aggregation: string,
	breakdown: Attribute | ComputedBreakdown,
	breakdownGroup: Group,
	column: MixedAttribute,
	row: Attribute,
	sourceForCompute: false
};

type ComputeTableData = {
	...BaseData,
	row: Attribute,
	sourceForCompute: true
};

export type TableData = BuildTableData | ComputeTableData;

export type Table = {
	body: {
		defaultValue: {
			label: string,
			value: DefaultTableValue
		},
		showRowNum: boolean,
		textAlign: TextAlign,
		textHandler: TextHandler
	},
	columnHeader: TableColumnHeader,
	rowHeader: {
		fontColor: string,
		fontStyle?: FontStyle
	}
};

export type TableWidget = {
	...BaseWidget,
	calcTotalColumn: boolean,
	calcTotalRow: boolean,
	columnsRatioWidth: Array<number>,
	data: Array<TableData>,
	sorting: TableSorting,
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
