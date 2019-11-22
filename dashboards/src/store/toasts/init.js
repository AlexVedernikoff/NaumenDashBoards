// @flow
import type {ToastsAction, ToastsState} from './types';
import {TOASTS_EVENTS} from './constants';

export const initialToastsState: ToastsState = {};

export const defaultToastsAction: ToastsAction = {
	type: TOASTS_EVENTS.UNKNOWN_TOASTS_ACTION
};
