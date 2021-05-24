// @flow
import {SOURCES_FILTERS_EVENTS} from './constants';
import type {ThunkAction} from 'store/types';

export type SourceFiltersItem =
{
	descriptor: string,
	id: ?string,
	label: string,
};

export type SourceFiltersItems = Array<SourceFiltersItem>;

export type SourceFilters = {
	filters: SourceFiltersItems,
	source: string,
};

export type DeleteSourceFilter = {
	id: ?string,
	source: string,
};

type UnknownSourcesFiltersAction = {
	type: typeof SOURCES_FILTERS_EVENTS.UNKNOWN_SOURCES_FILTERS_ACTION
};

type SetSourcesFiltersAction = {
	payload: SourceFilters,
	type: typeof SOURCES_FILTERS_EVENTS.UPDATE_SOURCE_FILTERS
};

type DeleteSourceFilterAction = {
	payload: DeleteSourceFilter,
	type: typeof SOURCES_FILTERS_EVENTS.DELETE_SOURCE_FILTER
};

type RequestSourceFiltersAction = {
	type: typeof SOURCES_FILTERS_EVENTS.REQUEST_SOURCE_FILTERS
};

type ReceiveSourceFiltersAction = {
	type: typeof SOURCES_FILTERS_EVENTS.RECEIVE_SOURCE_FILTERS
};

type RequestSourceFiltersErrorAction = {
	type: typeof SOURCES_FILTERS_EVENTS.REQUEST_SOURCE_FILTERS_ERROR
};

export type SourcesFiltersActions =
	| UnknownSourcesFiltersAction
	| SetSourcesFiltersAction
	| DeleteSourceFilterAction
	| RequestSourceFiltersAction
	| ReceiveSourceFiltersAction
	| RequestSourceFiltersErrorAction;

export type SourcesFiltersMap = {
	[key: string]: SourceFiltersItems;
};

export type SourcesFiltersState = {
	error: boolean,
	loading: boolean,
	map: SourcesFiltersMap,
};

export type ResultWithMessage = { result: true } | { message: string, result: false };

export type UpdateSourcesFilterResult = { filterId: string, result: true } | { message: string, result: false };

export type CheckApplyFilter = (source: string, sourceFilter: SourceFiltersItem) => ThunkAction;

export type DispatchCheckApplyFilter = (source: string, sourceFilter: SourceFiltersItem) => Promise<ResultWithMessage>;

export type FetchSourcesFilters = (metaClass: string) => ThunkAction;

export type DispatchFetchSourcesFilters = (metaClass: string) => Promise<void>;

export type UpdateSourcesFilter = (source: string, filter: SourceFiltersItem) => ThunkAction;

export type DispatchUpdateSourcesFilter = (source: string, filter: SourceFiltersItem) => Promise<UpdateSourcesFilterResult>;

export type DeleteSourcesFilter = (source: string, filterId: string) => ThunkAction;

export type DispatchDeleteSourcesFilter = (source: string, filterId: string) => Promise<ResultWithMessage>;
