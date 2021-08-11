// @flow
import {defaultSourcesFiltersAction, initialSourcesFiltersState} from './init';
import type {DeleteSourceFilter, SourceFilter, SourceFilters, SourcesFiltersActions, SourcesFiltersState} from './types';
import {SOURCES_FILTERS_EVENTS} from './constants';

const updateSourceFilterReducer = (state: SourcesFiltersState, sourceFilter: SourceFilter): SourcesFiltersState => {
	const {filter, source} = sourceFilter;
	const oldSavedFilters = state.map[source] ?? [];
	const newSavedFilters = [];

	oldSavedFilters.forEach((item) => {
		if (item.id === filter.id) {
			newSavedFilters.push(filter);
			return;
		}

		newSavedFilters.push(item);
	});

	const map = {
		...state.map,
		[source]: newSavedFilters
	};

	return { ...state, map };
};

const updateSourcesFiltersReducer = (state: SourcesFiltersState, sourceFilters: SourceFilters): SourcesFiltersState => {
	const {filters, source} = sourceFilters;
	const map = {
		...state.map,
		[source]: filters
	};

	return { ...state, map };
};

const deleteSourcesFiltersReducer = (state: SourcesFiltersState, deleteSourceFilter: DeleteSourceFilter): SourcesFiltersState => {
	const {id, source} = deleteSourceFilter;
	const newSourceFilters = state.map[source].filter(item => item.id !== id);
	const map = {
		...state.map,
		[source]: newSourceFilters
	};

	return { ...state, map };
};

const reducer = (state: SourcesFiltersState = initialSourcesFiltersState, action: SourcesFiltersActions = defaultSourcesFiltersAction): SourcesFiltersState => {
	switch (action.type) {
		case SOURCES_FILTERS_EVENTS.CLEAR_REQUEST_SOURCE_FILTERS_STATUS:
			return {
				...state,
				error: false,
				loading: false
			};
		case SOURCES_FILTERS_EVENTS.UPDATE_SOURCE_FILTER:
			return updateSourceFilterReducer(state, action.payload);
		case SOURCES_FILTERS_EVENTS.UPDATE_SOURCE_FILTERS:
			return updateSourcesFiltersReducer(state, action.payload);
		case SOURCES_FILTERS_EVENTS.DELETE_SOURCE_FILTER:
			return deleteSourcesFiltersReducer(state, action.payload);
		case SOURCES_FILTERS_EVENTS.REQUEST_SOURCE_FILTERS:
			return {
				...state,
				loading: true
			};
		case SOURCES_FILTERS_EVENTS.RECEIVE_SOURCE_FILTERS:
			return {
				...state,
				loading: false
			};
		case SOURCES_FILTERS_EVENTS.REQUEST_SOURCE_FILTERS_ERROR:
			return {
				...state,
				error: true,
				loading: false
			};
		default:
			return state;
	}
};

export default reducer;
