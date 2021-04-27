// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {
	Breakdown as WidgetBreakdown,
	ComputedAttr,
	Group,
	Indicator as WidgetIndicator,
	MixedAttribute,
	Parameter as WidgetParameter,
	Source,
	SourceData as WidgetSourceData,
	Widget,
	WidgetType
} from 'store/widgets/data/types';
import type {DashboardsState, FetchDashboards} from 'store/dashboards/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {InjectedProps} from 'containers/WidgetEditForm/types';
import type {LinkedDataSourceMap} from 'store/sources/linkedData/types';
import type {OnLoadCallback} from 'store/sources/types';
import type {ThunkAction} from 'store/types';

export type SourceData = {
	descriptor: string,
	value: Source | null
};

export type Indicator = {
	aggregation?: string,
	attribute: MixedAttribute | null
};

export type Parameter = {
	attribute: Attribute | null,
	group: Group
};

export type BreakdownItem = {
	attribute: Attribute | null,
	dataKey: string,
	group: Group
};

export type Breakdown = Array<BreakdownItem>;

export type DataSet = {
	breakdown?: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	parameters?: Array<Parameter>,
	source: SourceData,
	sourceForCompute: boolean,
	[key: string]: any | typeof undefined
};

export type FilledDataSet = {
	breakdown: WidgetBreakdown,
	dataKey: string,
	indicators: Array<WidgetIndicator>,
	parameters: Array<WidgetParameter>,
	source: WidgetSourceData,
	sourceForCompute: boolean,
	[key: string]: any | typeof undefined
};

export type DiagramFormWidget = {
	computedAttrs: Array<ComputedAttr>,
	data: Array<DataSet>,
	name: string,
	type: WidgetType
};

export type ConnectedProps = {|
	attributes: AttributesMap,
	dashboards: DashboardsState,
	dynamicGroups: DynamicGroupsMap,
	linkedSources: LinkedDataSourceMap,
	refAttributes: AttributesMap,
	sources: DataSourceMap
|};

export type FetchAttributes = (classFqn: string, parentClassFqn?: string | null, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchDynamicAttributeGroups = (dataKey: string, descriptor: string) => ThunkAction;

export type FetchDynamicAttributes = (dataKey: string, groupCode: string) => ThunkAction;

export type FetchRefAttributes = (refAttr: Attribute, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchLinkedDataSources = (classFqn: string) => ThunkAction;

export type ConnectedFunctions = {|
	fetchAttributes: FetchAttributes,
	fetchDashboards: FetchDashboards,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchLinkedDataSources: FetchLinkedDataSources,
	fetchRefAttributes: FetchRefAttributes
|};

export type Props = {|
	...InjectedProps,
	...ConnectedProps,
	...ConnectedFunctions,
	widget: Widget
|};
