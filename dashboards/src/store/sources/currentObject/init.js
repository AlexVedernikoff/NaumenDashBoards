// @flow
import type {CurrentObjectAction, CurrentObjectState} from './types';
import {CURRENT_OBJECT_EVENTS} from './constants';

export const initialCurrentObjectState: CurrentObjectState = {};

export const defaultCurrentObjectAction: CurrentObjectAction = {
	type: CURRENT_OBJECT_EVENTS.UNKNOWN_CURRENT_OBJECT_ACTION
};
