// @flow
import type {
	CheckApplyFilter,
	DeleteSourcesFilter,
	FetchSourcesFilters,
	SourceFiltersItem
} from 'store/sources/sourcesFilters/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {OnLoadCallback} from 'store/sources/types';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SourceFieldset/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	filterList: SourceFiltersItem[],
	filtersListLoading: boolean,
	sources: DataSourceMap
};

export type FetchAttributes = (classFqn: string, parentClassFqn?: string | null, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type FetchDynamicAttributes = (dataKey: string, groupCode: string, filterId: ?string) => ThunkAction;

export type ConnectedFunctions = {
	fetchSourcesFilters: FetchSourcesFilters,
	onCheckApplyFilter: CheckApplyFilter,
	onDeleteSourcesFilter: DeleteSourcesFilter,
	onFetchAttributes: FetchAttributes,
	onFetchDynamicAttributes: FetchDynamicAttributes,
	onUpdateSourcesFilter: (source: string, filter: SourceFiltersItem) => any
};

export type Props = ConnectedProps & ConnectedFunctions & ComponentProps;
