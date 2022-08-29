// @flow
import type {EntityState} from './types';
import {VERIFY_EVENTS} from './constants';

export const initialVerifyState: EntityState = {
	activeElement: null,
	data: [],
	error: false,
	exportTo: null,
	loading: false,
	scale: 1
};

export const defaultVerifyAction = {
	payload: null,
	type: VERIFY_EVENTS.EMPTY_DATA
};
