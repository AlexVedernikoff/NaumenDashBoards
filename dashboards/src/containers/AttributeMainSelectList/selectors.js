// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchDynamicAttributeGroups, fetchDynamicAttributes, fetchSearchDynamicAttributeGroups} from 'store/sources/dynamicGroups/actions';

export const props = (state: AppState): ConnectedProps => {
	const {data: sources, dynamicGroups} = state.sources;

	return {
		dynamicGroups,
		sources: sources.map
	};
};

export const functions: ConnectedFunctions = {
	fetchDynamicAttributeGroups,
	fetchDynamicAttributes,
	fetchSearchDynamicAttributeGroups
};
