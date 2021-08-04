// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

export const props = (state: AppState): ConnectedProps => {
	return {
		swiped: state.APP.hideEditPanel
	};
};
