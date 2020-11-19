// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {InjectedProps} from 'containers/WidgetEditForm/types';
import type {LinkedDataSourceMap} from 'store/sources/linkedData/types';
import type {OnLoadCallback} from 'store/sources/types';
import type {Source, Widget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';

export type DataSet = {
	source: Source,
	sourceForCompute: boolean,
	[string]: any
};

export type ConnectedProps = {|
	attributes: AttributesMap,
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