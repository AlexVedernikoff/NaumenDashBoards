// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {DynamicGroupsMap, FetchDynamicAttributeGroups, FetchDynamicAttributes} from 'store/sources/dynamicGroups/types';

export type ConnectedProps = {|
	dynamicGroups: DynamicGroupsMap,
	sources: DataSourceMap
|};

export type ConnectedFunctions = {|
	fetchDynamicAttributeGroups: FetchDynamicAttributeGroups,
	fetchDynamicAttributes: FetchDynamicAttributes
|};

export type Props = ConnectedProps & ConnectedFunctions;
