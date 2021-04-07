// @flow
import type {Breakdown, Indicator, Parameter, SourceData} from 'store/widgetForms/types';
import type {CommonDialogContextProps} from 'containers/CommonDialogs/types';
import type {DataSourceMap} from 'src/store/sources/data/types';
import type {DeleteSourcesFilter, SourceFiltersItem, UpdateSourcesFilter} from 'src/store/sources/sourcesFilters/types';
import type {FetchAttributes, FetchDynamicAttributes} from 'containers/SourceFieldset/types';
import {MODE} from './constraints';

export type DataSet = {
	breakdown?: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	parameters?: Array<Parameter>,
	source: SourceData,
	sourceForCompute: boolean
};

export type Props = CommonDialogContextProps & {
	filterList: SourceFiltersItem[],
	filtersListLoading: boolean,
	index: number,
	onChange: (index: number, dataSet: DataSet) => void,
	onCheckApplyFilter: (source: string, sourceFilter: SourceFiltersItem) => any,
	onDeleteSourcesFilter: DeleteSourcesFilter,
	onFetchAttributes: FetchAttributes,
	onFetchDynamicAttributes: FetchDynamicAttributes,
	onOpenFilterForm: () => Promise<string>,
	onRemove: (index: number) => void,
	onUpdateSourcesFilter: UpdateSourcesFilter,
	parentClassFqn: string | null,
	removable: boolean,
	sources: DataSourceMap,
	usesFilter: boolean,
	value: DataSet
};

export type ConfirmOption = {
	notice: boolean,
	resolve: (boolean) => void,
	text: string,
	title: string,
};

export type State = {
	error: ?string,
	mode: ?$Keys<typeof MODE>,
	showEditForm: boolean,
};
