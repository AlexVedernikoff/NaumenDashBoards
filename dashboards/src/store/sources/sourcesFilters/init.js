// @flow
import type {SourcesFiltersActions, SourcesFiltersState} from './types';
import {SOURCES_FILTERS_EVENTS} from './constants';

export const initialSourcesFiltersState: SourcesFiltersState = {
	error: false,
	errorMessage: null,
	loading: false,
	map: {}
};

export const defaultSourcesFiltersAction: SourcesFiltersActions = {
	type: SOURCES_FILTERS_EVENTS.UNKNOWN_SOURCES_FILTERS_ACTION
};
