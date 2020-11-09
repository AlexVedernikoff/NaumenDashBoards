// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchDynamicAttributeGroups, fetchDynamicAttributes} from 'store/sources/dynamicGroups/actions';
import {fetchLinkedDataSources} from 'store/sources/linkedData/actions';
import {fetchRefAttributes} from 'store/sources/refAttributes/actions';

export const props = (state: AppState): ConnectedProps => {
	const {attributes, data: attributeSources, dynamicGroups, linkedData: linkedSources, refAttributes} = state.sources;

	return {
		attributes,
		dynamicGroups,
		linkedSources,
		refAttributes,
		sources: attributeSources.map
	};
};

export const functions: ConnectedFunctions = {
	fetchAttributes,
	fetchDynamicAttributeGroups,
	fetchDynamicAttributes,
	fetchLinkedDataSources,
	fetchRefAttributes
};
