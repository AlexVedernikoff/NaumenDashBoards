// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchLinkedDataSources} from 'store/sources/linkedData/actions';

export const props = (state: AppState): ConnectedProps => {
	const {data: sources, linkedData: linkedSources} = state.sources;

	return {
		linkedSources,
		sources: sources.map
	};
};

export const functions: ConnectedFunctions = {
	fetchLinkedDataSources
};
