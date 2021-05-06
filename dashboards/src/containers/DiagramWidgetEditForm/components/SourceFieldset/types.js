// @flow
import type {
	CheckApplyFilter,
	DeleteSourcesFilter,
	FetchSourcesFilters,
	ResultWithMessage,
	SourceFiltersItem,
	UpdateSourcesFilter,
	UpdateSourcesFilterResult
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

export type ConnectedFunctions = {|
	checkApplyFilter: (source: string, sourceFilter: SourceFiltersItem) => ResultWithMessage,
	deleteSourcesFilter: (source: string, filterId: string) => ResultWithMessage,
	fetchSourcesFilters: (metaClass: string) => ResultWithMessage,
	updateSourcesFilter: (source: string, filter: SourceFiltersItem) => Promise<UpdateSourcesFilterResult>
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
