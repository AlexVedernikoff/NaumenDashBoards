// @flow
import type {
	AxisData,
	AxisSettings,
	ChartColorsSettings,
	ChartSorting,
	ComputedAttr,
	DataLabels,
	DisplayMode,
	Header,
	Legend,
	NavigationSettings
} from 'store/widgets/data/types';
import type {Breakdown, Indicator, Parameter, SourceData} from 'store/widgetForms/types';

export type DataSet = $Exact<{
	...AxisData,
	breakdown?: Breakdown,
	indicators: Array<Indicator>,
	parameters: Array<Parameter>,
	source: SourceData
}>;

export type Values = $Exact<{
	colorsSettings: ChartColorsSettings,
	computedAttrs: Array<ComputedAttr>,
	data: Array<DataSet>,
	dataLabels: DataLabels,
	displayMode: DisplayMode,
	header: Header,
	indicator: AxisSettings,
	legend: Legend,
	name: string,
	navigation: NavigationSettings,
	parameter: AxisSettings,
	sorting: ChartSorting,
	templateName: string
}>;

export type State = Values;
