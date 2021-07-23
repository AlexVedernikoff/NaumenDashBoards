// @flow
import type {StatesAction, StatesState} from './types';
import {STATES_EVENTS} from './constants';

export const initialStatesState: StatesState = {};

export const defaultStatesAction: StatesAction = {
	type: STATES_EVENTS.UNKNOWN_STATES_ACTION
};
