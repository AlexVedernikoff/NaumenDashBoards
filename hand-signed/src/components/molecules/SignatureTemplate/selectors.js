// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

const props = (appState: AppState): ConnectedProps => {
	const {signature} = appState;
	const {state} = signature;

	return {
		state
	}
};

export {
	props
};
