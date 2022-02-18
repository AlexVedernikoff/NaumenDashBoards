// @flow
import type {VerifyAction, VerifyState} from './types';
import {VERIFY_EVENTS} from './constants';

export const initialVerifyState: VerifyState = {
	data: {
		document: '',
		entities: [],
		message: '',
		object: ''
	},
	error: false,
	loading: false,
	notification: {
		isSuccess: true,
		show: false
	}
};

export const defaultVerifyAction: VerifyAction = {
	payload: null,
	type: VERIFY_EVENTS.EMPTY_DATA
};
