// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {DynamicGroupsMap, FetchDynamicAttributeGroupsAction, FetchDynamicAttributesAction} from 'store/sources/dynamicGroups/types';

export type ConnectedProps = {
	dynamicGroups: DynamicGroupsMap,
	sources: DataSourceMap
};

export type ConnectedFunctions = {
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroupsAction,
	fetchDynamicAttributes: FetchDynamicAttributesAction
};

export type Props = ConnectedFunctions & ConnectedProps;
