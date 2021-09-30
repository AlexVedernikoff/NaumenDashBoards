// @flow
import type {Breakdown, Indicator, Parameter, SourceData} from 'store/widgetForms/types';
import type {
	ComputedAttr,
	DataTopSettings,
	DisplayMode,
	Header,
	NavigationSettings,
	Table,
	TableData,
	TableSorting
} from 'store/widgets/data/types';

export type DataSet = $Exact<{
	...TableData,
	breakdown?: Breakdown,
	indicators: Array<Indicator>,
	parameters: Array<Parameter>,
	source: SourceData
}>;

export type Values = $Exact<{
	calcTotalColumn: boolean,
	computedAttrs: Array<ComputedAttr>,
	data: Array<DataSet>,
	displayMode: DisplayMode,
	header: Header,
	name: string,
	navigation: NavigationSettings,
	showBlankData: boolean,
	showEmptyData: boolean,
	showTotalAmount: boolean,
	sorting: TableSorting,
	table: Table,
	templateName: string,
	top: DataTopSettings,
}>;

export type State = Values;
