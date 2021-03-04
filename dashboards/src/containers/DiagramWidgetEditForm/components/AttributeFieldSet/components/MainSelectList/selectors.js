// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchDynamicAttributeGroups, fetchDynamicAttributes} from 'store/sources/dynamicGroups/actions';

export const props = (state: AppState): ConnectedProps => {
	const {data: sources, dynamicGroups} = state.sources;

	return {
		dynamicGroups,
		sources
	};
};

export const functions: ConnectedFunctions = {
	fetchDynamicAttributeGroups,
	fetchDynamicAttributes
};
