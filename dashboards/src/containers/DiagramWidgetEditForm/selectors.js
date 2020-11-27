// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchDashboards} from 'store/dashboards/actions';
import {fetchDynamicAttributeGroups, fetchDynamicAttributes} from 'store/sources/dynamicGroups/actions';
import {fetchLinkedDataSources} from 'store/sources/linkedData/actions';
import {fetchRefAttributes} from 'store/sources/refAttributes/actions';

export const props = (state: AppState): ConnectedProps => {
	const {dashboards, sources} = state;
	const {attributes, data: attributeSources, dynamicGroups, linkedData: linkedSources, refAttributes} = sources;

	return {
		attributes,
		dashboards,
		dynamicGroups,
		linkedSources,
		refAttributes,
		sources: attributeSources.map
	};
};

export const functions: ConnectedFunctions = {
	fetchAttributes,
	fetchDashboards,
	fetchDynamicAttributeGroups,
	fetchDynamicAttributes,
	fetchLinkedDataSources,
	fetchRefAttributes
};
