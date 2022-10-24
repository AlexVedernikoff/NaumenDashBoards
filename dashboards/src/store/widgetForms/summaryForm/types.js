// @flow
import type {
	ComparePeriod,
	ComputedAttr,
	DisplayMode,
	Header,
	NavigationSettings,
	SummaryData,
	SummaryIndicator,
	WidgetTooltip
} from 'store/widgets/data/types';
import type {Indicator, SourceData} from 'store/widgetForms/types';

export type DataSet = $Exact<{
	...SummaryData,
	indicators: Array<Indicator>,
	source: SourceData
}>;

export type Values = $Exact<{
	comparePeriod: ComparePeriod,
	computedAttrs: Array<ComputedAttr>,
	// $FlowFixMe
	data: Array<DataSet>,
	displayMode: DisplayMode,
	header: Header,
	indicator: SummaryIndicator,
	name: string,
	navigation: NavigationSettings,
	templateName: string,
	tooltip: WidgetTooltip
}>;

export type State = Values;
