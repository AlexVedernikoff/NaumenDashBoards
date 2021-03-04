// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchDynamicAttributeGroups, fetchDynamicAttributes} from 'store/sources/dynamicGroups/actions';
import {fetchRefAttributes} from 'store/sources/refAttributes/actions';

export const props = (state: AppState): ConnectedProps => {
	const {attributes, data: sources, dynamicGroups, refAttributes} = state.sources;

	return {
		attributes,
		dynamicGroups,
		refAttributes,
		sources: sources.map
	};
};

export const functions: ConnectedFunctions = {
	fetchAttributes,
	fetchDynamicAttributeGroups,
	fetchDynamicAttributes,
	fetchRefAttributes
};
