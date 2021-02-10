// @flow
import type {Action, State} from './types';
import {EVENTS} from './constants';

export const initialState: State = {};

export const defaultAction: Action = {
	type: EVENTS.UNKNOWN
};
