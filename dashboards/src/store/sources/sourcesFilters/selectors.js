// @flow
import type {AppState} from 'store/types';
import {createSelector} from 'reselect';
import {getMapValues} from 'helpers';
import type {SourceFiltersItem, SourceFiltersItems, SourcesFiltersState} from './types';

const getSourcesFilters = (state: AppState): SourcesFiltersState => state.sources.sourcesFilters;

const getSourceFilters = createSelector(
	getSourcesFilters,
	(sourcesFilters: SourcesFiltersState) => (source: string): SourceFiltersItems => sourcesFilters.map[source]
);

const findFilterById = createSelector(
	getSourcesFilters,
	(sourcesFilters: SourcesFiltersState) => (filterId: string): (SourceFiltersItem | null) => {
		const allSourceFiltersItem = getMapValues(sourcesFilters.map).flat();
		return allSourceFiltersItem.find(filter => filter.id === filterId) ?? null;
	}
);

export {
	getSourcesFilters,
	getSourceFilters,
	findFilterById
};
