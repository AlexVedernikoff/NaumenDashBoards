// @flow
import type {VerificationAction, VerificationState} from './types';
import {VERIFICATION_EVENTS} from './constants';

export const initialVerificationState: VerificationState = {
	attrCode: false,
	code: '',
	error: false,
	finish: false,
	index: 0,
	isFullChecked: false,
	loading: false,
	message: '',
	values: []
};

export const defaultVerificationAction: VerificationAction = {
	payload: null,
	type: VERIFICATION_EVENTS.EMPTY_DATA
};
