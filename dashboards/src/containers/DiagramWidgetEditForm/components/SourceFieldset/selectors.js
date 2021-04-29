// @flow
import type {AppState} from 'store/types';
import {checkApplyFilter, deleteSourcesFilter, fetchSourcesFilters, updateSourcesFilter} from 'store/sources/sourcesFilters/actions';
import type {ConnectedProps, ConnectingFunctions, ContainerProps} from './types';
import {getSourceFilters, getSourcesFilters} from 'store/sources/sourcesFilters/selectors';

export const props = (state: AppState, props: $Shape<ContainerProps>): ConnectedProps => {
	const {dataSet: {source}} = props;
	const {value} = source;
	const {value: sourceValue} = value ?? {};
	const filtersList = getSourcesFilters(state);
	const { loading: filtersListLoading } = filtersList;
	const filterList = getSourceFilters(state)(sourceValue);

	return {
		filterList,
		filtersListLoading
	};
};

export const functions: ConnectingFunctions = {
	checkApplyFilter,
	deleteSourcesFilter,
	fetchSourcesFilters,
	updateSourcesFilter
};
