// @flow
import type {EntityState} from './types';
import {VERIFY_EVENTS} from './constants';

export const initialVerifyState: EntityState = {
	data: [],
	error: false,
	loading: false
};

export const defaultVerifyAction = {
	payload: null,
	type: VERIFY_EVENTS.EMPTY_DATA
};
