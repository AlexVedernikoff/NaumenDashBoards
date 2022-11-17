// @flow
import type {EntityState} from './types';
import {VERIFY_EVENTS} from './constants';

export const initialVerifyState: EntityState = {
	activeElement: null,
	centerPointUuid: null,
	data: [],
	error: false,
	exportTo: null,
	loading: false,
	position: {x: 0, y: 0},
	scale: 1
};

export const defaultVerifyAction = {
	payload: null,
	type: VERIFY_EVENTS.EMPTY_DATA
};
