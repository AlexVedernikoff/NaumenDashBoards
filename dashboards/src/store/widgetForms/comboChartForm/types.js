// @flow
import type {
	AxisSettings,
	ChartColorsSettings,
	ChartSorting,
	ComboIndicatorSettings,
	ComboType,
	ComputedAttr,
	DataLabels,
	DisplayMode,
	Header,
	Legend,
	NavigationSettings,
	WidgetTooltip
} from 'store/widgets/data/types';
import type {DataSet as AxisDataSet} from 'store/widgetForms/axisChartForm/types';

export type DataSet = $Exact<{
	...AxisDataSet,
	__type: 'COMBO_DATA_SET',
	type: ComboType
}>;

export type Values = $Exact<{
	colorsSettings: ChartColorsSettings,
	computedAttrs: Array<ComputedAttr>,
	data: Array<DataSet>,
	dataLabels: DataLabels,
	displayMode: DisplayMode,
	header: Header,
	indicator: ComboIndicatorSettings,
	legend: Legend,
	name: string,
	navigation: NavigationSettings,
	parameter: AxisSettings,
	showTotalAmount: boolean,
	sorting: ChartSorting,
	templateName: string,
	tooltip: WidgetTooltip
}>;

export type State = Values;
