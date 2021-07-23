// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchRefAttributes} from 'store/sources/refAttributes/actions';

export const props = (state: AppState): ConnectedProps => {
	const {refAttributes} = state.sources;

	return {
		refAttributes
	};
};

export const functions: ConnectedFunctions = {
	fetchRefAttributes
};
