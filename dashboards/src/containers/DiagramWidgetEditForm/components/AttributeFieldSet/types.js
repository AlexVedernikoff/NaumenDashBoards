// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {OnLoadCallback} from 'store/sources/types';
import type {SourceData} from 'containers/DiagramWidgetEditForm/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {|
	attributes: AttributesMap,
	dynamicGroups: DynamicGroupsMap,
	refAttributes: AttributesMap,
	sources: DataSourceMap
|};

export type FetchAttributes = (classFqn: string, parentClassFqn?: string | null, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchDynamicAttributeGroups = (dataKey: string, descriptor: string, filterId?: string) => ThunkAction;

export type FetchDynamicAttributes = (dataKey: string, groupCode: string) => ThunkAction;

export type FetchRefAttributes = (refAttr: Attribute, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchLinkedDataSources = (classFqn: string) => ThunkAction;

export type ConnectedFunctions = {|
	fetchAttributes: FetchAttributes,
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes,
	fetchRefAttributes: FetchRefAttributes
|};

export type ContextProps = {
	dataKey: string,
	dataSetIndex: number,
	source: SourceData
};
