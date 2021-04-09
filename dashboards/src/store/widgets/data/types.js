// @flow
import type {Action, ChangingState, ThunkAction} from 'store/types';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	CHART_COLORS_SETTINGS_TYPES,
	COMBO_TYPES,
	COPY_WIDGET_ERRORS,
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

export type ResetFocusedWidget = () => Action;

export type FocusWidget = (widgetId: string) => Action;

export type DisplayMode = $Keys<typeof DISPLAY_MODE>;

export type FontStyle = $Keys<typeof FONT_STYLES>;

export type TextAlign = $Keys<typeof TEXT_ALIGNS>;

export type TextHandler = $Keys<typeof TEXT_HANDLERS>;

export type SortingType = $Keys<typeof SORTING_TYPES>;

export type SortingValue = $Keys<typeof SORTING_VALUES>;

export type GroupType = string;

export type GroupWay = $Keys<typeof GROUP_WAYS>;

export type WidgetType = $Keys<typeof WIDGET_TYPES>;

export type Source = {
	label: string,
	value: string
};

export type SourceData = {
	descriptor: string,
	value: Source
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

export type Parameter = {
	attribute: Attribute,
	group: Group
};

export type BreakdownItem = {
	attribute: Attribute,
	dataKey: string,
	group: Group
};

export type Breakdown = Array<BreakdownItem>;

export type Indicator = {
	aggregation: string,
	attribute: MixedAttribute | null
};

export type DataTopSettings = {
	count: number | null,
	show: boolean
};

// Общие параметры всех виджетов

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
	templateName: string,
	warningMessage?: string
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
	type: SortingType,
	value: SortingValue
};

export type DataLabels = {
	fontColor: string,
	fontFamily: string,
	fontSize: number,
	show: boolean,
	showShadow: boolean
};

// Настройка цветов графика
export type ChartColorSettings = {
	color: string,
	key: string
};

export type CustomChartColorsSettingsData = {
	colors: Array<ChartColorSettings>,
	defaultColor: string,
	key: string
};

export type ChartColorsSettingsType = $Keys<typeof CHART_COLORS_SETTINGS_TYPES>;

export type AutoChartColorsSettings = {
	colors: Array<string>
};

export type CustomChartColorsSettings = {
	data?: CustomChartColorsSettingsData,
	useGlobal: boolean
};

export type ChartColorsSettings = {
	auto: AutoChartColorsSettings,
	custom: CustomChartColorsSettings,
	type: ChartColorsSettingsType
};

// График с осями

export type AxisSettings = {
	show: boolean,
	showName: boolean
};

export type AxisData = {
	breakdown?: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	parameters: Array<Parameter>,
	showBlankData: boolean,
	showEmptyData: boolean,
	source: SourceData,
	sourceForCompute: boolean,
	top: DataTopSettings,
	xAxisName: string,
	yAxisName: string
};

export type AxisWidgetType = $Keys<typeof WIDGET_SETS.AXIS>;

export type AxisWidget = {
	...BaseWidget,
	colorsSettings: ChartColorsSettings,
	data: Array<AxisData>,
	dataLabels: DataLabels,
	indicator: AxisSettings,
	legend: Legend,
	parameter: AxisSettings,
	sorting: ChartSorting,
	type: AxisWidgetType,
};

// Круговой график

export type CircleData = {
	breakdown: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	showBlankData: boolean,
	showEmptyData: boolean,
	source: SourceData,
	sourceForCompute: boolean,
	top: DataTopSettings
};

export type CircleWidgetType = $Keys<typeof WIDGET_SETS.CIRCLE>;

export type CircleWidget = {
	...BaseWidget,
	colorsSettings: ChartColorsSettings,
	data: Array<CircleData>,
	dataLabels: DataLabels,
	legend: Legend,
	sorting: ChartSorting,
	type: CircleWidgetType
};

// Комбо график

export type ComboIndicatorSettings = $Shape<{
	...AxisSettings,
	max: number,
	min: number,
	showDependent: boolean
}>;

type ComboType = $Keys<typeof COMBO_TYPES>;

export type ComboData = {
	...AxisData,
	type: ComboType
};

export type ComboWidget = {
	...BaseWidget,
	colorsSettings: ChartColorsSettings,
	data: Array<ComboData>,
	dataLabels: DataLabels,
	indicator: ComboIndicatorSettings,
	legend: Legend,
	parameter: AxisSettings,
	sorting: ChartSorting,
	type: typeof WIDGET_TYPES.COMBO,
};

export type ChartDataSet = AxisData | CircleData | ComboData;

// Сводка

export type SummaryData = {
	dataKey: string,
	indicators: Array<Indicator>,
	source: SourceData,
	sourceForCompute: boolean
};

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

export type TableData = {
	breakdown?: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	parameters: Array<Parameter>,
	source: SourceData,
	sourceForCompute: boolean
};

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
	breakdown: boolean,
	parameter: boolean
};

export type TableWidget = {
	...BaseWidget,
	calcTotalColumn: boolean,
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

export type SetWidgetWarning = {
	id: string,
	message: string,
};

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

export type SetFocusedWidget = {
	payload: string,
	type: typeof WIDGETS_EVENTS.SET_FOCUSED_WIDGET
};

export type SetWidgets = {
	payload: Array<Widget>,
	type: typeof WIDGETS_EVENTS.SET_WIDGETS
};

type UnknownWidgetsAction = {
	payload: null,
	type: typeof WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION
};

export type SetMessageWarning = {
	payload: SetWidgetWarning,
	type: typeof WIDGETS_EVENTS.WIDGET_SET_WARNING
};

export type ClearMessageWarning = {
	payload: string,
	type: typeof WIDGETS_EVENTS.WIDGET_CLEAR_WARNING
};

export type WidgetsAction =
	| AddWidget
	| ClearMessageWarning
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
	| SetFocusedWidget
	| SetWidgets
	| UpdateWidget
	| SetMessageWarning
	| UnknownWidgetsAction
;

export type WidgetMap = {
	[key: string]: Widget;
};

export type WidgetsDataState = {
	copying: ChangingState,
	deleting: ChangingState,
	focusedWidget: string,
	map: WidgetMap,
	saving: ChangingState,
	selectedWidget: string,
	validatingToCopy: ChangingState
};

export type SetUseGlobalChartSettings = (key: string, useGlobal: boolean, targetWidgetId?: string) => ThunkAction;

export type CopyWidgetError = $Values<typeof COPY_WIDGET_ERRORS>;

export type ValidateWidgetToCopyResult = {
	isValid: boolean,
	reasons?: Array<CopyWidgetError>,
};
