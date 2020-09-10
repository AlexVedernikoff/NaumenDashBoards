// @flow
import type {LinkedDataSourcesAction, LinkedDataSourcesState} from './types';
import {LINKED_DATA_SOURCES_EVENTS} from './constants';

export const initialDataSourcesState: LinkedDataSourcesState = {};

export const defaultDataSourcesAction: LinkedDataSourcesAction = {
	payload: null,
	type: LINKED_DATA_SOURCES_EVENTS.UNKNOWN_LINKED_DATA_SOURCES_ACTION
};
