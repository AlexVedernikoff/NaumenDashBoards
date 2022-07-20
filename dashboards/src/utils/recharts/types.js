// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {AxisFormatter, CircleFormatter, ComboFormatter, NumberFormatter, PercentStore} from './formater/types';
import type {AxisSettings, BordersStyle, DataLabels, FontStyle, Group, Legend, Ranges, SpeedometerIndicatorSettings, TextHandler} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDownMixin} from 'store/widgets/links/types';
import {LABEL_DRAW_MODE, LEGEND_ALIGN, LEGEND_LAYOUT, LEGEND_VERTICAL_ALIGN, SUB_TOTAL_POSITION} from './constants';
import type {WidgetTooltip} from 'store/widgets/data/types.js';

export type Labels = Array<Array<string>>;

export type DrillDownErrorOptions = {
	mode: 'disable' | 'error'
};

export type DrillDownSuccessOptions = {
	index: number,
	mixin: DrillDownMixin,
	mode: 'success'
};

export type DrillDownOptions = DrillDownErrorOptions | DrillDownSuccessOptions;

export type GetDrillDownOptions = (parameter: string, breakdown?: string) => DrillDownOptions;

export type GetCircleDrillDownOptions = (breakdown: string) => DrillDownOptions;

export type GetComboDrillDownOptions = (dataKey: string, parameter: string, breakdown?: string) => DrillDownOptions;

export type SubTotalGetter = {
	getter: (parameter: string) => number,
	position: $Keys<typeof SUB_TOTAL_POSITION>
};

export type RechartDataItem = {
	name: string,
	[column: string]: number
};

export type RechartData = Array<RechartDataItem>;

export type RechartSeriesData = {
	data: RechartData,
	percentStore: PercentStore
};

export type RechartCircleItem = {
	color: string,
	name: string,
	value: number
};

export type CircleData = Array<RechartCircleItem>;

export type RechartCircleData = {
	data: CircleData,
	percentStore: PercentStore
};

export type RechartPieDataItem = {
	color: string,
	name: string,
	value: number
};

export type RechartPieData = Array<RechartPieDataItem>;

export type RechartDomain = number | string | (value: number) => number;

export type SeriesInfo = Array<{
	breakdownLabels: null | Array<string>,
	color: (string) => string,
	key: string,
	label: string,
	type: string | null
}>;

export type ComboSeriesInfo = Array<{
	color: string,
	key: string,
	label: string,
	type: string | null
}>;

export type CircleSeries = Array<{
	breakdownLabels: string[],
	color: (string) => string
}>;

export type ReChartLegend = {
	align: $Values<typeof LEGEND_ALIGN>,
	height?: number,
	layout: $Values<typeof LEGEND_LAYOUT>,
	show: boolean,
	style: Object,
	textHandler: TextHandler,
	verticalAlign: $Values<typeof LEGEND_VERTICAL_ALIGN>,
	width?: number,
};

export type AxisOptions = {
	axisName: string,
	domain: ?[RechartDomain, RechartDomain],
	fontFamily: string,
	fontSize: number,
	height?: number,
	interval: number,
	mode: $Keys<typeof LABEL_DRAW_MODE>,
	multilineLabels?: Labels,
	show: boolean,
	showName: boolean,
	width?: number
};

export type DataLabelsOptions = {
	fontColor: string,
	fontFamily: string,
	fontSize: number,
	show: boolean,
	showShadow: boolean
};

export type EmptyChartOptions = {
	type: 'EmptyChartOptions'
};

export type AxisChartOptions = {
	data: RechartData,
	dataLabels: DataLabelsOptions,
	formatters: AxisFormatter,
	getDrillDownOptions: GetDrillDownOptions,
	legend: ReChartLegend,
	series: SeriesInfo,
	stacked: ?boolean,
	stackId: ?string,
	stackOffset: ?string,
	subTotalGetter: ?SubTotalGetter,
	type: 'AxisChartOptions',
	xaxis: AxisOptions,
	yaxis: AxisOptions
};

export type CircleChartOptions = {
	data: CircleData,
	dataLabels: DataLabelsOptions,
	formatters: CircleFormatter,
	getDrillDownOptions: GetCircleDrillDownOptions,
	innerRadius: number | string,
	legend: ReChartLegend,
	type: 'CircleChartOptions',
};

export type SpeedometerBorderOptions = {
	formatter: NumberFormatter,
	max: number,
	min: number,
	show: boolean,
	style: BordersStyle
};

export type SpeedometerDataOptions = {
	formatter: NumberFormatter,
	style: SpeedometerIndicatorSettings,
	title: string,
	tooltip: ?WidgetTooltip,
	total: number
};

export type SpeedometerOptions = {
	borders: Object,
	data: SpeedometerDataOptions,
	ranges: Ranges & {formatter: NumberFormatter},
	size: {height: number, width: number},
	type: 'SpeedometerOptions',
};

export type ComboAxisOptions = AxisOptions & {
	color: string,
	dataKey: string,
	max: number,
	min: number,
};

export type ComboChartOptions = {
	data: RechartData,
	dataLabels: DataLabelsOptions,
	formatters: ComboFormatter,
	getDrillDownOptions: GetComboDrillDownOptions,
	legend: ReChartLegend,
	series: ComboSeriesInfo,
	type: 'ComboChartOptions',
	xaxis: AxisOptions,
	yaxis: ComboAxisOptions[]
};

export type SummaryData = {
	formatter: NumberFormatter,
	tooltip: ?WidgetTooltip,
};

export type SummaryStyle = {
	color: string,
	fontFamily: string,
	fontSize: number | string,
	fontStyle?: FontStyle
};

export type SummaryOptions = {
	data: SummaryData,
	style: SummaryStyle,
	type: 'SummaryOptions',
};

/** PIVOT */

export type PivotDataRowStyle = {
	backgroundColor?: string
};

export type PivotDataRow = {
	children: ?Array<PivotDataRow>,
	level: number,
	style: PivotDataRowStyle,
	values: Array<string>,
};

export type PivotColumnFlat = {
	key: string
};

export type PivotSeriesData = Array<PivotDataRow>;

export type PivotColumn = Object;

export type PivotOptions = {
	columnsList: Array<PivotColumnFlat>,
	columnWidth: number,
	data: PivotSeriesData,
	headers: Array<PivotColumn>,
	type: 'PivotOptions',
};

export type ChartOptions =
	| EmptyChartOptions
	| AxisChartOptions
	| CircleChartOptions
	| ComboChartOptions
	| PivotOptions
	| SpeedometerOptions
	| SummaryOptions;

export type CalculateCategoryWidthResult = {
	mode: $Keys<typeof LABEL_DRAW_MODE>,
	width: number,
};

export type CalculateCategoryHeightResult = {
	height: number,
	labels?: Labels,
	mode: $Keys<typeof LABEL_DRAW_MODE>
};

export type CalculateCategoryRotateHeight = {
	height: number,
	interval: number
};

export type CalculateStringsSizeItem = {
	height: number,
	width: number
};

export type CalculateStringsSizeResult = {[label: string]: CalculateStringsSizeItem};

export type AddFiltersProps = {
	buildData: DiagramBuildData,
	config: Object,
	mixin: DrillDownMixin
};

export type AddFilterProps = {
	attribute?: Attribute,
	group?: Group,
	value: string
};

export type DefaultChartSettings = {
	axis: AxisSettings,
	dataLabels: DataLabels,
	legend: Legend
};

export type MultilineHeightResult = {
	height: number,
	labels: Labels
};

export type ValueFromSeriesLabelResult = {
	percent: ?number,
	value: ?number
};
