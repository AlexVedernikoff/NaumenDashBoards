// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {AxisFormatter, CircleFormatter, ComboFormatter, NumberFormatter} from './formater/types';
import type {AxisSettings, BordersStyle, DataLabels, FontStyle, Group, Legend, Ranges, SpeedometerIndicatorSettings, TextHandler} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDownMixin} from 'store/widgets/links/types';
import {LABEL_DRAW_MODE, LEGEND_ALIGN, LEGEND_LAYOUT, LEGEND_VERTICAL_ALIGN} from './constants';

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

export type RechartDataItem = {
	name: string,
	[column: string]: number
};

export type RechartData = Array<RechartDataItem>;

export type RechartPieDataItem = {
	color: string,
	name: string,
	value: number
};

export type RechartPieData = Array<RechartPieDataItem>;

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
	height: number | null,
	layout: $Values<typeof LEGEND_LAYOUT>,
	show: boolean,
	style: Object,
	textHandler: TextHandler,
	verticalAlign: $Values<typeof LEGEND_VERTICAL_ALIGN>,
	width: number | null,
};

export type AxisOptions = {
	axisName: string,
	fontFamily: string,
	fontSize: number,
	height?: number,
	mode: $Keys<typeof LABEL_DRAW_MODE>,
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
	type: 'AxisChartOptions',
	xaxis: AxisOptions,
	yaxis: AxisOptions
};

export type CircleChartOptions = {
	data: RechartData,
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
	tooltip: string | null,
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
	tooltip: string | null
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

export type ChartOptions =
	| EmptyChartOptions
	| AxisChartOptions
	| CircleChartOptions
	| ComboChartOptions
	| SpeedometerOptions
	| SummaryOptions;

export type CalculateCategoryWidthResult = {
	mode: $Keys<typeof LABEL_DRAW_MODE>,
	width: number,
};

export type CalculateCategoryHeightResult = {
	height: number,
	mode: $Keys<typeof LABEL_DRAW_MODE>,
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
