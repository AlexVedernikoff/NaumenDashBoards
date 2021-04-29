// @flow
import type {
	CheckApplyFilter,
	DeleteSourcesFilter,
	FetchSourcesFilters,
	ResultWithMessage,
	SourceFiltersItem,
	UpdateSourcesFilter
} from 'store/sources/sourcesFilters/types';
import type {DataSet, SourceData} from 'containers/DiagramWidgetEditForm/types';
import type {DataSourceMap} from 'store/sources/data/types';

export type ConnectedProps = {|
	filterList: SourceFiltersItem[],
	filtersListLoading: boolean
|};

export type ConnectingFunctions = {|
	checkApplyFilter: CheckApplyFilter,
	deleteSourcesFilter: DeleteSourcesFilter,
	fetchSourcesFilters: FetchSourcesFilters,
	updateSourcesFilter: UpdateSourcesFilter
|};

export type CheckApplyFilterConnected = (source: string, sourceFilter: SourceFiltersItem) => ResultWithMessage;

export type DeleteSourcesFilterConnected = (source: string, filterId: string) => ResultWithMessage;

export type FetchSourcesFiltersConnected = (metaClass: string) => ResultWithMessage;

export type UpdateSourcesFilterConnected = (source: string, filter: SourceFiltersItem) => ResultWithMessage;

export type ConnectedFunctions = {|
	checkApplyFilter: CheckApplyFilterConnected,
	deleteSourcesFilter: DeleteSourcesFilterConnected,
	fetchSourcesFilters: FetchSourcesFiltersConnected,
	updateSourcesFilter: UpdateSourcesFilterConnected
|};

export type ContainerProps = {
	computable: boolean,
	dataSet: DataSet,
	dataSetIndex: number,
	error: string,
	onChangeDataSet: (dataSetIndex: number, source: SourceData) => void,
	onChangeForCompute: (dataSetIndex: number, value: boolean) => void,
	onFetchDynamicAttributes: (dataSetIndex: number, descriptor: string) => void,
	onRemove: (index: number) => void,
	openFilterForm: (context: Object) => Promise<string>,
	removable: boolean,
	sources: DataSourceMap,
	usesFilter: boolean;
};

export type Props = ConnectedProps & ConnectedFunctions & ContainerProps;
