// @flow

import {ATTRIBUTE_EVENTS} from './constants';
import type {AttributesAction, AttributesState} from './types';

export const initialAttributesState: AttributesState = {
	attributes: [],
	error: false,
	loading: false
};

export const defaultAttributesAction: AttributesAction = {
	payload: null,
	type: ATTRIBUTE_EVENTS.EMPTY_DATA
};
