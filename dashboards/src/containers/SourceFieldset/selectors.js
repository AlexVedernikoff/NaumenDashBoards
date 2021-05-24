// @flow
import type {AppState} from 'store/types';
import {
	checkApplyFilter,
	deleteSourcesFilter,
	fetchSourcesFilters,
	updateSourcesFilter
} from 'store/sources/sourcesFilters/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchDynamicAttributes} from 'store/sources/dynamicGroups/actions';
import {getSourceFilters, getSourcesFilters} from 'store/sources/sourcesFilters/selectors';
import {isPersonalDashboard} from 'store/dashboard/settings/selectors';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SourceFieldset/types';

export const props = (state: AppState, props: ComponentProps): ConnectedProps => {
	const {sources, value: {source}} = props;
	const {value} = source;
	const {value: sourceValue} = value ?? {};
	const isPersonal = isPersonalDashboard(state);
	const filtersList = getSourcesFilters(state);
	const { loading: filtersListLoading } = filtersList;
	const filterList = getSourceFilters(state)(sourceValue);

	return {
		filterList,
		filtersListLoading,
		isPersonal,
		sources: sources ?? state.sources.data.map
	};
};

export const functions: ConnectedFunctions = {
	fetchSourcesFilters,
	onCheckApplyFilter: checkApplyFilter,
	onDeleteSourcesFilter: deleteSourcesFilter,
	onFetchAttributes: fetchAttributes,
	onFetchDynamicAttributes: fetchDynamicAttributes,
	onUpdateSourcesFilter: updateSourcesFilter
};
