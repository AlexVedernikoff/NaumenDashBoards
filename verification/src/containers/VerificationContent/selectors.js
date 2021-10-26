// @flow

import type {ConnectedFunctions, ConnectedProps} from './types';
import {sendVerificationValue, setIndexVerification, setVerificationAttribute} from 'store/verification/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => {
	const {setting} = state.setting;
	const {attributes} = state.attributes;
	const verification = state.verification;

	return {
		attributes,
		setting,
		verification
	};
};

export const functions: ConnectedFunctions = {
	sendVerificationValue,
	setIndexVerification,
	setVerificationAttribute
};
