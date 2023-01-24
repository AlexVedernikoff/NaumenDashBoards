// @flow
import type {Action, ChangingState, ThunkAction} from 'store/types';
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	AXIS_FORMAT_TYPE,
	CHART_COLORS_SETTINGS_TYPES,
	COMBO_TYPES,
	COMPARE_PERIOD,
	COPY_WIDGET_ERRORS,
	DEFAULT_TABLE_VALUE,
	DISPLAY_MODE,
	FONT_STYLES,
	HEADER_POSITIONS,
	INDICATOR_GROUPING_TYPE,
	LABEL_FORMATS,
	NOTATION_FORMATS,
	RANGES_POSITION,
	RANGES_TYPES,
	SORTING_TYPES,
	SORTING_VALUES,
	TEXT_ALIGNS,
	TEXT_HANDLERS,
	WIDGET_SETS,
	WIDGET_TYPES
} from './constants';
import type {DashboardItem, WidgetItem} from 'store/dashboards/types';
import type {DivRef} from 'components/types';
import {GROUP_WAYS} from 'store/widgets/constants';
import {LEGEND_DISPLAY_TYPES, LEGEND_POSITIONS} from 'utils/recharts/constants';
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

export type CustomFilter = {
	attributes: Attribute[],
	descriptor?: string | null,
	label: string,
};

export type SourceData = {
	descriptor: string,
	filterId?: string | null,
	value: Source,
	widgetFilterOptions?: CustomFilter[]
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

export type PercentageRelativeAttr = {|
	code: string,
	descriptor: string,
	title: string,
	type: typeof ATTRIBUTE_TYPES.PERCENTAGE_RELATIVE_ATTR
|};

export type MixedAttribute = ComputedAttr | PercentageRelativeAttr | Attribute;

export type LabelFormat = $Keys<typeof LABEL_FORMATS>;

export type LabelAxisFormat = {
	labelFormat?: LabelFormat,
	type: typeof AXIS_FORMAT_TYPE.LABEL_FORMAT,
};

export type NumberAxisFormat = {
	additional?: ?string,
	notation?: ?$Values<typeof NOTATION_FORMATS>,
	splitDigits?: ?boolean,
	symbolCount?: ?number,
	type: typeof AXIS_FORMAT_TYPE.NUMBER_FORMAT | typeof AXIS_FORMAT_TYPE.INTEGER_FORMAT,
};

export type AxisFormat = LabelAxisFormat | NumberAxisFormat;

export type ComparePeriodFormat = {
	down?: string,
	symbolCount?: ?number,
	up?: string,
};

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

export type WidgetTooltip = {
	fontFamily?: string,
	fontSize?: number,
	header?: string,
	show: boolean,
	text?: string,
	title?: string /* deprecated */
};

export type Indicator = {
	aggregation: string,
	attribute: MixedAttribute | null,
	tooltip?: WidgetTooltip | null
};

export type DataTopSettings = {
	count: ?number,
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
	showSubTotalAmount: boolean,
	showTotalAmount: boolean,
	templateName: string,
	tooltip: WidgetTooltip,
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
	dataKey?: string,
	type: SortingType,
	value: SortingValue
};

export type DataLabels = {
	computedFormat?: AxisFormat,
	disabled: boolean,
	fontColor: string,
	fontFamily: string,
	fontSize: number,
	format?: AxisFormat,
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
	data: CustomChartColorsSettingsData | null,
	useGlobal: boolean
};

export type ChartColorsSettings = {
	auto: AutoChartColorsSettings,
	custom: CustomChartColorsSettings,
	type: ChartColorsSettingsType
};

// График с осями

export type AxisSettings = {
	fontFamily: string,
	fontSize: number,
	format?: AxisFormat,
	show: boolean,
	showName: boolean
};

export type ComparePeriod = {
	allow: boolean,
	endDate?: string,
	format?: ComparePeriodFormat,
	period: $Keys<typeof COMPARE_PERIOD>,
	show: boolean,
	startDate?: string
};

export type AxisData = {
	__type: 'AXIS_DATA_SET',
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
	breakdownFormat?: AxisFormat,
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
	__type: 'CIRCLE_DATA_SET',
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
	breakdownFormat?: AxisFormat,
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
	max: number | string,
	min: number | string,
	showDependent: boolean
}>;

export type ComboType = $Keys<typeof COMBO_TYPES>;

export type ComboData = {
	...AxisData,
	__type: 'COMBO_DATA_SET',
	type: ComboType
};

export type ComboWidget = {
	...BaseWidget,
	breakdownFormat?: AxisFormat,
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
	__type: 'SUMMARY_DATA_SET',
	dataKey: string,
	indicators: Array<Indicator>,
	source: SourceData,
	sourceForCompute: boolean
};

export type SummaryIndicator = {
	computedFormat?: NumberAxisFormat,
	fontColor: string,
	fontFamily: string,
	fontSize: number | string,
	fontStyle?: FontStyle,
	format?: NumberAxisFormat
};

export type SummaryWidget = {
	...BaseWidget,
	comparePeriod: ComparePeriod,
	data: Array<SummaryData>,
	indicator: SummaryIndicator,
	type: typeof WIDGET_TYPES.SUMMARY
};

// Спидометр
export type SpeedometerIndicatorSettings = {
	computedFormat?: NumberAxisFormat,
	fontColor: string,
	fontFamily: string,
	fontSize: number | string,
	fontStyle: ?FontStyle,
	format?: NumberAxisFormat,
	show: boolean
};

export type Range = {
	color: string,
	from: string | number,
	to: string | number
};

export type Border = {
	indicator: ?Indicator,
	isNumber: boolean,
	value: number
};

export type BordersStyle = {
	fontColor: string,
	fontFamily: string,
	fontSize: number | string,
	fontStyle?: FontStyle,
	format: ?NumberAxisFormat,
	show: boolean
};

export type Borders = {
	max: Border,
	min: Border,
	style: BordersStyle
};

export type RangesTypes = $Keys<typeof RANGES_TYPES>;

export type RangesPosition = $Keys<typeof RANGES_POSITION>;

export type RangesStyle = {
	displayType: LegendDisplayType,
	fontColor: string,
	fontFamily: string,
	fontSize: number | string,
	fontStyle: ?FontStyle,
	format: ?NumberAxisFormat,
	legendPosition: LegendPosition,
	position: RangesPosition,
	show: boolean,
	textHandler: TextHandler
};

export type Ranges = {
	data: Array<Range>,
	style: RangesStyle,
	type: RangesTypes,
	use: boolean
};

export type SpeedometerData = {
	...SummaryData,
	__type: 'SPEEDOMETER_DATA_SET',
};

export type SpeedometerWidget = {
	...BaseWidget,
	borders: Borders,
	data: Array<SpeedometerData>,
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
	__type: 'TABLE_DATA_SET',
	breakdown?: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	parameters: Array<Parameter>,
	source: SourceData,
	sourceForCompute: boolean,
	sourceRowName?: string | null,
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
	columnsRatioWidth?: ColumnsRatioWidth,
	data: Array<TableData>,
	ignoreDataLimits?: IgnoreTableDataLimitsSettings,
	showBlankData: boolean,
	showEmptyData: boolean,
	sorting: TableSorting,
	table: Table,
	top: DataTopSettings,
	type: typeof WIDGET_TYPES.TABLE
};

// Pivot

export type PivotHeaderSettings = TableHeaderSettings & {};

export type PivotBodySettings = {
	...TableBodySettings,
	parameterRowColor?: string
};

export type PivotStyle = {
	body: PivotBodySettings,
	columnHeader: PivotHeaderSettings
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
	variables: Variables,
	warningMessage?: string
};

export type PivotLink = {
	attribute: Attribute | null,
	dataKey1: string,
	dataKey2: string,
};

export type PivotIndicator = {
	...Indicator,
	breakdown?: BreakdownItem,
	key: string
};

export type PivotData = {
	__type: 'PIVOT_DATA_SET',
	dataKey: string,
	indicators: Array<PivotIndicator>,
	parameters: Array<Parameter>,
	source: SourceData,
	sourceForCompute: boolean
};

export type ParameterOrder = {
	dataKey: string,
	parameter: Parameter
};

export type IndicatorInfo = {
	checked?: boolean,
	hasBreakdown: boolean,
	key: string,
	label: string,
	type: typeof INDICATOR_GROUPING_TYPE.INDICATOR_INFO
};

export type GroupIndicatorInfo = {
	checked?: boolean,
	children?: Array<GroupIndicatorInfo | IndicatorInfo>,
	hasSum: boolean,
	key: string,
	label: string,
	type: typeof INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO
};

export type IndicatorGrouping = Array<GroupIndicatorInfo | IndicatorInfo>;

export type PivotWidget = {
	...BaseWidget,
	data: Array<PivotData>,
	indicatorGrouping: IndicatorGrouping | null,
	links: Array<PivotLink>,
	parametersOrder: Array<ParameterOrder>,
	pivot: PivotStyle,
	showTotalAmount: boolean,
	showTotalRowAmount: boolean,
	type: typeof WIDGET_TYPES.PIVOT_TABLE
};

export type DataSet =
	| AxisData
	| CircleData
	| ComboData
	| SummaryData
	| TableData
	| PivotData;

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
	| PivotWidget
;

export type AnyWidget =
	| Widget
	| TextWidget
;

export type EditWidgetChunkDataAction = (widget: Widget, chunkData: Object, refreshData?: boolean) => ThunkAction;

export type UpdateWidgetAction = (widget: Widget, chunkData: Object, refreshData?: boolean) => ThunkAction;

export type SetWidgetWarning = {
	id: string,
	message: string,
};

export type ClearWidgetFiltersAction = (widget: Widget) => ThunkAction;

export type CallWidgetFiltersAction = (widget: Widget, dataSetIndex: number, filterIndex: number) => ThunkAction;

export type AddWidget = {
	payload: NewWidget,
	type: 'widgets/data/addWidget'
};

export type UpdateWidget = {
	payload: Widget,
	type: 'widgets/data/updateWidget'
};

export type SetCreatedWidget = {
	payload: Widget,
	type: 'widgets/data/setCreatedWidget'
};

export type DeleteWidget = {
	payload: string,
	type: 'widgets/data/deleteWidget'
};

export type SelectWidget = {
	payload: string,
	type: 'widgets/data/setSelectedWidget'
};

export type ResetWidget = {
	type: 'widgets/data/resetWidget',
};

export type RecordValidateToCopyError = {
	type: 'widgets/data/recordValidateToCopyError',
};

export type RecordWidgetCopyError = {
	type: 'widgets/data/recordWidgetCopyError',
};

export type RecordWidgetSaveError = {
	type: 'widgets/data/recordWidgetSaveError',
};

export type RequestValidateToCopy = {
	type: 'widgets/data/requestValidateToCopy',
};

export type RequestWidgetCopy = {
	type: 'widgets/data/requestWidgetCopy',
};

export type RequestWidgetDelete = {
	type: 'widgets/data/requestWidgetDelete',
};

export type RequestWidgetSave = {
	type: 'widgets/data/requestWidgetSave',
};

export type ResponseValidateToCopy = {
	type: 'widgets/data/responseValidateToCopy',
};

export type ResponseWidgetCopy = {
	type: 'widgets/data/responseWidgetCopy',
};

export type RecordWidgetDeleteError = {
	type: 'widgets/data/recordWidgetDeleteError'
};

export type ResetFocusedWidgetAction = {
	type: 'widgets/data/resetFocusedWidget'
};

export type SetFocusedWidget = {
	payload: string,
	type: 'widgets/data/setFocusedWidget'
};

export type SetWidgets = {
	payload: Array<Widget>,
	type: 'widgets/data/setWidgets'
};

type UnknownWidgetsAction = {
	payload: null,
	type: 'widgets/data/unknownWidgetsAction'
};

export type SetMessageWarning = {
	payload: SetWidgetWarning,
	type: 'widgets/data/widgetSetWarning'
};

export type ClearMessageWarning = {
	payload: string,
	type: 'widgets/data/widgetClearWarning'
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
	| ResetFocusedWidgetAction
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

export type SetUseGlobalChartSettingsAction = (key: string, useGlobal: boolean, targetWidgetId?: string) => ThunkAction;

export type SaveWidgetWithNewFiltersAction = (widget: $Shape<Widget>) => ThunkAction;

export type AddNewWidgetAction = (widget: NewWidget, relativeElement?: DivRef) => ThunkAction;

export type DispatchAddNewWidget = (widget: NewWidget, relativeElement?: DivRef) => Promise<void>;

export type CopyWidgetError = $Values<typeof COPY_WIDGET_ERRORS>;

export type ValidateWidgetToCopyResult = {
	isValid: boolean,
	reasons?: Array<CopyWidgetError>,
};
