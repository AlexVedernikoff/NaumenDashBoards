// @flow
import type {AttrSetConditions} from 'utils/descriptorUtils/types';
import type {Attribute, FetchAttributeByCode, FetchAttributes} from 'store/sources/attributes/types';
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
import type {ClearDynamicAttributeGroups} from 'store/sources/dynamicGroups/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {InjectedProps as OpenFormProps} from 'containers/FilterForm/types';
import type {OnLoadCallback} from 'store/sources/types';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SourceFieldset/types';

export type DataSet = {
	breakdown?: Breakdown,
	dataKey: string,
	indicators: Array<Indicator>,
	parameters?: Array<Parameter>,
	source: SourceData,
	sourceForCompute: boolean,
	sourceRowName?: string | null
};

export type ConnectedProps = {
	autoSelectFirstItem: boolean,
	disabled: boolean,
	filterList: SourceFiltersItem[],
	filtersListLoading: boolean,
	isPersonal: boolean,
	isUserMode: boolean,
	showSavedFilters: boolean,
	sources: DataSourceMap
};

export type DispatchFetchAttributes = (classFqn: string, parentClassFqn?: ?string, attrSetConditions?: ?AttrSetConditions, onLoadCallback?: OnLoadCallback) => Promise<void>;

export type DispatchFetchAttributeByCode = (classFqn: string, attribute: Attribute) => Promise<Attribute>;

export type ConnectedFunctions = {
	fetchAttributeByCode: FetchAttributeByCode,
	fetchSourcesFilters: FetchSourcesFilters,
	onCheckApplyFilter: CheckApplyFilter,
	onDeleteSourcesFilter: DeleteSourcesFilter,
	onFetchAttributes: FetchAttributes,
	onUpdateSourcesFilter: UpdateSourcesFilter
};

export type DispatchConnectedFunctions = {
	clearDynamicAttributeGroups: ClearDynamicAttributeGroups,
	fetchAttributeByCode: DispatchFetchSourcesFilters,
	fetchSourcesFilters: DispatchFetchSourcesFilters,
	onCheckApplyFilter: DispatchCheckApplyFilter,
	onDeleteSourcesFilter: DispatchDeleteSourcesFilter,
	onFetchAttributes: DispatchFetchAttributes,
	onUpdateSourcesFilter: DispatchUpdateSourcesFilter
};

export type Props = ConnectedProps & DispatchConnectedFunctions & OpenFormProps & ComponentProps;
