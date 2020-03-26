// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchMetaClassStates} from 'store/sources/attributesData/states/actions';

export const props = (state: AppState): ConnectedProps => {
	const {states} = state.sources.attributesData;

	return {
		states
	};
};

export const functions: ConnectedFunctions = {
	fetchMetaClassStates
};
