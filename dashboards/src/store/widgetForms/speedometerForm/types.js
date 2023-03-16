// @flow
import type {
	AxisSettings,
	Borders,
	ComputedAttr,
	DisplayMode,
	Header,
	NavigationSettings,
	Ranges,
	SpeedometerData,
	SpeedometerIndicatorSettings,
	WidgetTooltip
} from 'store/widgets/data/types';
import type {Indicator, SourceData} from 'store/widgetForms/types';

export type DataSet = $Exact<{
	...SpeedometerData,
	__type: 'SPEEDOMETER_DATA_SET',
	indicators: Array<Indicator>,
	source: SourceData
}>;

export type Values = $Exact<{
	borders: Borders,
	computedAttrs: Array<ComputedAttr>,
	// $FlowFixMe
	data: Array<DataSet>,
	displayMode: DisplayMode,
	header: Header,
	indicator: SpeedometerIndicatorSettings,
	name: string,
	navigation: NavigationSettings,
	parameter: AxisSettings,
	ranges: Ranges,
	templateName: string,
	tooltip: WidgetTooltip
}>;

export type State = Values;
