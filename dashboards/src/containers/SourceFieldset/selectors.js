// @flow
import type {AppState} from 'store/types';
import {
	checkApplyFilter,
	deleteSourcesFilter,
	fetchSourcesFilters,
	updateSourcesFilter
} from 'store/sources/sourcesFilters/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributeByCode, fetchAttributes} from 'store/sources/attributes/actions';
import {getSourceFilters, getSourcesFilters} from 'store/sources/sourcesFilters/selectors';
import {isPersonalDashboard, isRestrictUserModeDashboard, isUserModeDashboard} from 'store/dashboard/settings/selectors';
import type {Props as ComponentProps} from 'WidgetFormPanel/components/SourceFieldset/types';

export const props = (state: AppState, props: ComponentProps): ConnectedProps => {
	const {sources, value: {source}} = props;
	const {value} = source;
	const {value: sourceValue} = value ?? {};
	const isPersonal = isPersonalDashboard(state);
	const filtersList = getSourcesFilters(state);
	const {loading: filtersListLoading} = filtersList;
	const filterList = getSourceFilters(state)(sourceValue);
	const isUserMode = isUserModeDashboard(state);
	const isRestrictUserMode = isRestrictUserModeDashboard(state);
	const autoSelectFirstItem = isRestrictUserMode;
	const disabled = isRestrictUserMode;

	return {
		autoSelectFirstItem,
		disabled,
		filterList,
		filtersListLoading,
		isPersonal,
		isUserMode,
		showSavedFilters: !isUserMode,
		sources: sources ?? state.sources.data.map
	};
};

export const functions: ConnectedFunctions = {
	fetchAttributeByCode,
	fetchSourcesFilters,
	onCheckApplyFilter: checkApplyFilter,
	onDeleteSourcesFilter: deleteSourcesFilter,
	onFetchAttributes: fetchAttributes,
	onUpdateSourcesFilter: updateSourcesFilter
};
