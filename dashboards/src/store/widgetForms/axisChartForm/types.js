// @flow
import type {
	AxisData,
	AxisFormat,
	AxisSettings,
	ChartColorsSettings,
	ChartSorting,
	ComputedAttr,
	DataLabels,
	DisplayMode,
	Header,
	Legend,
	NavigationSettings,
	WidgetTooltip
} from 'store/widgets/data/types';
import type {Breakdown, Indicator, Parameter, SourceData} from 'store/widgetForms/types';

export type DataSet = $Exact<{
	...AxisData,
	__type: 'AXIS_DATA_SET',
	breakdown?: Breakdown,
	indicators: Array<Indicator>,
	parameters: Array<Parameter>,
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
	indicator: AxisSettings,
	legend: Legend,
	name: string,
	navigation: NavigationSettings,
	parameter: AxisSettings,
	showSubTotalAmount: boolean,
	showTotalAmount: boolean,
	sorting: ChartSorting,
	templateName: string,
	tooltip: WidgetTooltip
}>;

export type State = Values;
