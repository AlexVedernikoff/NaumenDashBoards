// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

const props = (appState: AppState): ConnectedProps => {
	const {signature} = appState;
	const {loading} = signature;

	return {
		loading
	}
};

export {
	props
};
