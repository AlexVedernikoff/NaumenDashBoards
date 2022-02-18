// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchGroupsAttributes} from 'store/sources/attributesData/groupsAttributes/actions';

export const props = (state: AppState): ConnectedProps => ({
	attributes: state.sources.attributes,
	isUserMode: false,
	sources: state.sources.data.map,
	sourcesFilters: state.sources.sourcesFilters.map

});

export const functions = {
	fetchAttributes,
	fetchGroupsAttributes
};
