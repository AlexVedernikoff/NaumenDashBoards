// @flow
import type {
	AxisFormat,
	ChartColorsSettings,
	ChartSorting,
	CircleData,
	ComputedAttr,
	DataLabels,
	DisplayMode,
	Header,
	Legend,
	NavigationSettings,
	WidgetTooltip
} from 'store/widgets/data/types';
import type {Breakdown, Indicator, SourceData} from 'store/widgetForms/types';

export type DataSet = $Exact<{
	...CircleData,
	__type: 'CIRCLE_DATA_SET',
	breakdown: Breakdown,
	indicators: Array<Indicator>,
	source: SourceData
}>;

export type Values = $Exact<{
	breakdownFormat: ?AxisFormat,
	colorsSettings: ChartColorsSettings,
	computedAttrs: Array<ComputedAttr>,
	data: Array<DataSet>,
	dataLabels: DataLabels,
	displayMode: DisplayMode,
	header: Header,
	legend: Legend,
	name: string,
	navigation: NavigationSettings,
	showTotalAmount: boolean,
	sorting: ChartSorting,
	templateName: string,
	tooltip: WidgetTooltip
}>;

export type State = Values;
