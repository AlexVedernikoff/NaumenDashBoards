// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

export const props = (state: AppState): ConnectedProps => {
	const {user} = state.APP;

	return {
		user
	};
};

export const functions: ConnectedFunctions = {
};
