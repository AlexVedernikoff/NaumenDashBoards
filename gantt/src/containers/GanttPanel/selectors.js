// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

export const props = (state: AppState): ConnectedProps => {
	const {
		isPersonal
	} = state.APP;

	return {
		isPersonal,
		swiped: state.APP.hideEditPanel
	};
};
