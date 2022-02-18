// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {setNotificationData} from 'store/verify/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => {
	const {verify} = state;

	return {
		verify
	};
};

export const functions: ConnectedFunctions = {
	setNotificationData
};
