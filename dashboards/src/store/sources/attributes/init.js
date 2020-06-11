// @flow
import type {AttributesAction, AttributesState} from './types';
import {ATTRIBUTES_EVENTS} from './constants';

export const initialAttributesState: AttributesState = {};

export const defaultAttributesAction: AttributesAction = {
	type: ATTRIBUTES_EVENTS.UNKNOWN_ATTRIBUTES_ACTION,
	payload: null
};
