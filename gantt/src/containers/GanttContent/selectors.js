// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {USER_ROLES} from 'store/App/constants';

export const props = (state: AppState): ConnectedProps => {
	const {errorData, loading, user} = state.APP;
	const {role} = user;

	return {
		editMode: role === USER_ROLES.MASTER || role === USER_ROLES.SUPER,
		errorData,
		loading
	};
};
