// @flow
import type {Breakdown, Indicator, Parameter, SourceData} from 'store/widgetForms/types';
import type {
	CheckApplyFilter,
	DeleteSourcesFilter,
	DispatchCheckApplyFilter,
	DispatchDeleteSourcesFilter,
	DispatchFetchSourcesFilters,
	DispatchUpdateSourcesFilter,
	FetchSourcesFilters,
	SourceFiltersItem,
	UpdateSourcesFilter
} from 'store/sources/sourcesFilters/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {OnLoadCallback} from 'store/sources/types';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SourceFieldset/types';
import type {ThunkAction} from 'store/types';

export type DataSet = {
	breakdown?: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	parameters?: Array<Parameter>,
	source: SourceData,
	sourceForCompute: boolean
};

export type ConnectedProps = {
	filterList: SourceFiltersItem[],
	filtersListLoading: boolean,
	isPersonal: boolean,
	sources: DataSourceMap
};

export type FetchAttributes = (classFqn: string, parentClassFqn?: string | null, onLoadCallback?: OnLoadCallback) => ThunkAction;

export type DispatchFetchAttributes = (classFqn: string, parentClassFqn?: string | null, onLoadCallback?: OnLoadCallback) => Promise<void>;

export type FetchDynamicAttributes = (dataKey: string, groupCode: string, filterId: ?string) => ThunkAction;

export type DispatchFetchDynamicAttributes = (dataKey: string, groupCode: string, filterId: ?string) => Promise<void>;

export type ConnectedFunctions = {
	fetchSourcesFilters: FetchSourcesFilters,
	onCheckApplyFilter: CheckApplyFilter,
	onDeleteSourcesFilter: DeleteSourcesFilter,
	onFetchAttributes: FetchAttributes,
	onFetchDynamicAttributes: FetchDynamicAttributes,
	onUpdateSourcesFilter: UpdateSourcesFilter
};

export type DispatchConnectedFunctions = {
	fetchSourcesFilters: DispatchFetchSourcesFilters,
	onCheckApplyFilter: DispatchCheckApplyFilter,
	onDeleteSourcesFilter: DispatchDeleteSourcesFilter,
	onFetchAttributes: DispatchFetchAttributes,
	onFetchDynamicAttributes: DispatchFetchDynamicAttributes,
	onUpdateSourcesFilter: DispatchUpdateSourcesFilter
};

export type Props = ConnectedProps & DispatchConnectedFunctions & ComponentProps;
