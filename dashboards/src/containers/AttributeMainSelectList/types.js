// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {DynamicGroupsMap} from 'store/sources/dynamicGroups/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	dynamicGroups: DynamicGroupsMap,
	sources: DataSourceMap
};

export type ConnectedFunctions = {
	fetchDynamicAttributeGroups: (dataKey: string, descriptor: string, filterId: ?string) => ThunkAction,
	fetchDynamicAttributes: (dataKey: string, groupCode: string) => ThunkAction,
	fetchSearchDynamicAttributeGroups: (dataKey: string, searchValue: string, descriptor: string, filterId: ?string) => ThunkAction,
};

export type Props = ConnectedFunctions & ConnectedProps;
