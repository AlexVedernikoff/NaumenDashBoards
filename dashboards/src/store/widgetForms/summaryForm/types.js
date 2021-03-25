// @flow
import type {
	ComputedAttr,
	DisplayMode,
	Header,
	NavigationSettings,
	SummaryData,
	SummaryIndicator
} from 'store/widgets/data/types';
import type {Indicator, SourceData} from 'store/widgetForms/types';

export type DataSet = $Exact<{
	...SummaryData,
	indicators: Array<Indicator>,
	source: SourceData
}>;

export type Values = $Exact<{
	computedAttrs: Array<ComputedAttr>,
	data: Array<DataSet>,
	displayMode: DisplayMode,
	header: Header,
	indicator: SummaryIndicator,
	name: string,
	navigation: NavigationSettings,
	templateName: string
}>;

export type State = Values;