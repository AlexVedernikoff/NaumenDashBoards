// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchAttributes} from 'store/sources/attributes/actions';

export const props = (state: AppState): ConnectedProps => {
	const {attributes} = state.sources;

	return {
		attributes
	};
};

export const functions: ConnectedFunctions = {
	fetchAttributes
};
