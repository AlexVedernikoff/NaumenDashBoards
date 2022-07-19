// @flow
import type {AttrSetConditions} from 'utils/descriptorUtils/types';
import type {Attribute, FetchAttributeByCodeAction, FetchAttributesAction} from 'store/sources/attributes/types';
import type {Breakdown, Indicator, Parameter, SourceData} from 'store/widgetForms/types';
import type {
	CheckApplyFilterAction,
	DeleteSourcesFilterAction,
	DispatchCheckApplyFilter,
	DispatchDeleteSourcesFilter,
	DispatchFetchSourcesFilters,
	DispatchUpdateSourcesFilter,
	FetchSourcesFiltersAction,
	SourceFiltersItem,
	UpdateSourcesFilterAction
} from 'store/sources/sourcesFilters/types';
import type {ClearDynamicAttributeGroupsAction} from 'store/sources/dynamicGroups/types';
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
	fetchAttributeByCode: FetchAttributeByCodeAction,
	fetchSourcesFilters: FetchSourcesFiltersAction,
	onCheckApplyFilter: CheckApplyFilterAction,
	onDeleteSourcesFilter: DeleteSourcesFilterAction,
	onFetchAttributes: FetchAttributesAction,
	onUpdateSourcesFilter: UpdateSourcesFilterAction
};

export type DispatchConnectedFunctions = {
	clearDynamicAttributeGroups: ClearDynamicAttributeGroupsAction,
	fetchAttributeByCode: DispatchFetchSourcesFilters,
	fetchSourcesFilters: DispatchFetchSourcesFilters,
	onCheckApplyFilter: DispatchCheckApplyFilter,
	onDeleteSourcesFilter: DispatchDeleteSourcesFilter,
	onFetchAttributes: DispatchFetchAttributes,
	onUpdateSourcesFilter: DispatchUpdateSourcesFilter
};

export type Props = ConnectedProps & DispatchConnectedFunctions & OpenFormProps & ComponentProps;
