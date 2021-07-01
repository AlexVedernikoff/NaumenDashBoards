// @flow
import type {ConnectedProps} from './types';
import type {AppState} from 'store/types';

const props = (appState: AppState): ConnectedProps => {
	const {signature} = appState;
	const {error} = signature;

	return {
		error
	}
};

export {
	props
};
