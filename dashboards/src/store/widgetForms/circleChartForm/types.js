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
	NavigationSettings
} from 'store/widgets/data/types';
import type {Breakdown, Indicator, SourceData} from 'store/widgetForms/types';

export type DataSet = $Exact<{
	...CircleData,
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
	sorting: ChartSorting,
	templateName: string
}>;

export type State = Values;
