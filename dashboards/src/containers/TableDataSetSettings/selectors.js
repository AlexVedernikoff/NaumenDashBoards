// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchLinkedDataSources} from 'store/sources/linkedData/actions';
import {isUserModeDashboard} from 'store/dashboard/settings/selectors';

export const props = (state: AppState): ConnectedProps => {
	const {data: sources, linkedData: linkedSources} = state.sources;
	const isUserMode = isUserModeDashboard(state);

	return {
		isUserMode,
		linkedSources,
		sources: sources.map
	};
};

export const functions: ConnectedFunctions = {
	fetchLinkedDataSources
};
