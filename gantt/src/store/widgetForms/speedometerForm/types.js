// @flow
import type {
	Borders,
	ComputedAttr,
	DisplayMode,
	Header,
	NavigationSettings,
	Ranges,
	SpeedometerData,
	SpeedometerIndicatorSettings
} from 'store/widgets/data/types';
import type {Indicator, SourceData} from 'store/widgetForms/types';

export type DataSet = $Exact<{
	...SpeedometerData,
	indicators: Array<Indicator>,
	source: SourceData
}>;

export type Values = $Exact<{
	borders: Borders,
	computedAttrs: Array<ComputedAttr>,
	data: Array<DataSet>,
	displayMode: DisplayMode,
	header: Header,
	indicator: SpeedometerIndicatorSettings,
	name: string,
	navigation: NavigationSettings,
	ranges: Ranges,
	templateName: string
}>;

export type State = Values;
