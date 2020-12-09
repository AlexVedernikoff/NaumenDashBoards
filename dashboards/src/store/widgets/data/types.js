// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {ChangingState, ThunkAction} from 'store/types';
import {
	COMBO_TYPES,
	DEFAULT_TABLE_VALUE,
	DISPLAY_MODE,
	FONT_STYLES,
	HEADER_POSITIONS,
	RANGES_TYPES,
	SORTING_TYPES,
	SORTING_VALUES,
	TEXT_ALIGNS,
	TEXT_HANDLERS,
	WIDGET_SETS,
	WIDGET_TYPES,
	WIDGETS_EVENTS
} from './constants';
import type {DashboardItem, WidgetItem} from 'store/dashboards/types';
import {GROUP_WAYS} from 'store/widgets/constants';
import {LEGEND_DISPLAY_TYPES, LEGEND_POSITIONS} from 'utils/chart';
import NewWidget from './NewWidget';

export type DisplayMode = $Keys<typeof DISPLAY_MODE>;

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
	format?: string,
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

export type DataTopSettings = {
	count: number,
	show: boolean
};

// Общие параметры всех виджетов

type BaseData = {
	dataKey: string,
	descriptor: string,
	source: Source
};

export type HeaderPosition = $Keys<typeof HEADER_POSITIONS>;

export type Header = {
	fontColor: string,
	fontFamily: string,
	fontSize: number,
	fontStyle?: FontStyle,
	name: string,
	position: HeaderPosition,
	show: boolean,
	template: string,
	textAlign: TextAlign,
	textHandler: TextHandler,
	useName: boolean
};

export type NavigationSettings = {
	dashboard: DashboardItem | null,
	show: boolean,
	showTip: boolean,
	tip: string,
	widget: WidgetItem | null,
};

type BaseWidget = {|
	computedAttrs: Array<ComputedAttr>,
	displayMode: DisplayMode,
	header: Header,
	id: string,
	name: string,
	navigation: NavigationSettings,
	templateName: string
|};

// Общие параметры графиков

export type LegendPosition = $Keys<typeof LEGEND_POSITIONS>;

export type LegendDisplayType = $Keys<typeof LEGEND_DISPLAY_TYPES>;

export type Legend = {
	displayType: LegendDisplayType,
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
	showEmptyData: boolean,
	sourceForCompute: false,
	top: DataTopSettings,
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
	showEmptyData: boolean,
	sourceForCompute: false,
	top: DataTopSettings
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

export type ComboIndicatorSettings = $Shape<{
	...AxisIndicator,
	max: number,
	min: number,
	showDependent: boolean
}>;

type ComboType = $Keys<typeof COMBO_TYPES>;

export type BuildComboData = {
	...BuildAxisData,
	type: ComboType,
	yAxisName: string
};

export type ComboData = ComputeAxisData | BuildComboData;

export type ComboWidget = {
	...BaseWidget,
	colors: Array<string>,
	data: Array<ComboData>,
	dataLabels: DataLabels,
	indicator: ComboIndicatorSettings,
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
	fontSize: number | string,
	fontStyle?: FontStyle
};

export type SummaryWidget = {
	...BaseWidget,
	data: Array<SummaryData>,
	indicator: SummaryIndicator,
	type: typeof WIDGET_TYPES.SUMMARY
};

// Спидометр
export type SpeedometerIndicatorSettings = {
	fontColor: string,
	fontFamily: string,
	fontSize: number | string,
	fontStyle?: FontStyle,
	show: boolean
};

export type Range = {
	color: string,
	from: string | number,
	to: string | number
};

export type Borders = {
	max: string,
	min: string
};

export type RangesType = $Keys<typeof RANGES_TYPES>;

export type Ranges = {
	data: Array<Range>,
	type: RangesType,
	use: boolean
};

export type SpeedometerData = SummaryData;

export type SpeedometerWidget = {
	...BaseWidget,
	borders: Borders,
	data: Array<SummaryData>,
	indicator: SpeedometerIndicatorSettings,
	ranges: Ranges,
	type: typeof WIDGET_TYPES.SPEEDOMETER
};

// Таблица

export type DefaultTableValue = $Keys<typeof DEFAULT_TABLE_VALUE>;

export type TableSorting = {
	accessor: string | null,
	type: SortingType
};

export type Parameter = {
	attribute: Attribute,
	group: Group
};

export type Indicator = {
	aggregation: string,
	attribute: Attribute
};

type BuildTableData = {
	...BaseData,
	breakdown: Attribute | ComputedBreakdown,
	breakdownGroup: Group,
	indicators: Array<Indicator>,
	parameters: Array<Parameter>,
	showEmpty: boolean,
	sourceForCompute: false
};

type ComputeTableData = {
	...BaseData,
	parameters: Array<Parameter>,
	sourceForCompute: true
};

export type TableData = BuildTableData | ComputeTableData;

export type TableCellSettings = {
	fontColor: string,
	fontStyle?: FontStyle
};

export type TableHeaderSettings = {
	...TableCellSettings,
	textAlign: TextAlign,
	textHandler: TextHandler
};

export type TableBodySettings = {
	defaultValue: {
		label: string,
		value: DefaultTableValue
	},
	indicatorSettings: TableCellSettings,
	pageSize: number,
	parameterSettings: TableCellSettings,
	showRowNum: boolean,
	textAlign: TextAlign,
	textHandler: TextHandler
};

export type Table = {
	body: TableBodySettings,
	columnHeader: TableHeaderSettings
};

export type ColumnsRatioWidth = {
	[accessor: string]: number
};

export type IgnoreTableDataLimitsSettings = {
	indicator: boolean,
	parameter: boolean
};

export type TableWidget = {
	...BaseWidget,
	calcTotalColumn: boolean,
	calcTotalRow: boolean,
	columnsRatioWidth: ColumnsRatioWidth,
	data: Array<TableData>,
	ignoreDataLimits?: IgnoreTableDataLimitsSettings,
	showEmptyData: boolean,
	sorting: TableSorting,
	table: Table,
	top: DataTopSettings,
	type: typeof WIDGET_TYPES.TABLE
};

// Text

export type TextSettings = {
	content: Object,
	styleMap: Object,
	textAlign: TextAlign
};

type Variables = {
	[key: string]: string
};

export type TextWidget = {
	displayMode: DisplayMode,
	id: string,
	text: string,
	textSettings: TextSettings,
	type: typeof WIDGET_TYPES.TEXT,
	variables: Variables
};

export type Chart =
	| AxisWidget
	| CircleWidget
	| ComboWidget
;

export type Widget =
	| Chart
	| SpeedometerWidget
	| SummaryWidget
	| TableWidget
;

export type AnyWidget =
	| Widget
	| TextWidget
;

export type DiagramWidgetDataSet =
	| AxisData
	| CircleData
	| ComboData
	| SummaryData
	| SpeedometerData
	| TableData
;

export type EditWidgetChunkData = (widget: Widget, chunkData: Object) => ThunkAction;

export type AddWidget = {
	payload: NewWidget,
	type: typeof WIDGETS_EVENTS.ADD_WIDGET
};

export type UpdateWidget = {
	payload: Widget,
	type: typeof WIDGETS_EVENTS.UPDATE_WIDGET
};

export type SetCreatedWidget = {
	payload: Widget,
	type: typeof WIDGETS_EVENTS.SET_CREATED_WIDGET
};

export type DeleteWidget = {
	payload: string,
	type: typeof WIDGETS_EVENTS.DELETE_WIDGET
};

export type SelectWidget = {
	payload: string,
	type: typeof WIDGETS_EVENTS.SET_SELECTED_WIDGET
};

export type ResetWidget = {
	type: typeof WIDGETS_EVENTS.RESET_WIDGET,
};

export type RecordValidateToCopyError = {
	type: typeof WIDGETS_EVENTS.RECORD_VALIDATE_TO_COPY_ERROR,
};

export type RecordWidgetCopyError = {
	type: typeof WIDGETS_EVENTS.RECORD_WIDGET_COPY_ERROR,
};

export type RecordWidgetSaveError = {
	type: typeof WIDGETS_EVENTS.RECORD_WIDGET_SAVE_ERROR,
};

export type RequestValidateToCopy = {
	type: typeof WIDGETS_EVENTS.REQUEST_VALIDATE_TO_COPY,
};

export type RequestWidgetCopy = {
	type: typeof WIDGETS_EVENTS.REQUEST_WIDGET_COPY,
};

export type RequestWidgetDelete = {
	type: typeof WIDGETS_EVENTS.REQUEST_WIDGET_DELETE,
};

export type RequestWidgetSave = {
	type: typeof WIDGETS_EVENTS.REQUEST_WIDGET_SAVE,
};

export type ResponseValidateToCopy = {
	type: typeof WIDGETS_EVENTS.RESPONSE_VALIDATE_TO_COPY,
};

export type ResponseWidgetCopy = {
	type: typeof WIDGETS_EVENTS.RESPONSE_WIDGET_COPY,
};

export type RecordWidgetDeleteError = {
	type: typeof WIDGETS_EVENTS.RECORD_WIDGET_DELETE_ERROR
};

export type SetWidgets = {
	payload: Array<Widget>,
	type: typeof WIDGETS_EVENTS.SET_WIDGETS
};

type UnknownWidgetsAction = {
	payload: null,
	type: typeof WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION
};

export type WidgetsAction =
	| AddWidget
	| DeleteWidget
	| RecordValidateToCopyError
	| RecordWidgetCopyError
	| RecordWidgetDeleteError
	| RecordWidgetSaveError
	| RequestValidateToCopy
	| RequestWidgetCopy
	| RequestWidgetDelete
	| RequestWidgetSave
	| ResetWidget
	| ResponseValidateToCopy
	| ResponseWidgetCopy
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
	copying: ChangingState,
	deleting: ChangingState,
	map: WidgetMap,
	saving: ChangingState,
	selectedWidget: string,
	validatingToCopy: ChangingState
};
