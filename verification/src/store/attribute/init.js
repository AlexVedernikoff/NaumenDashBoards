// @flow
import type {AttributeState, AttributeAction} from './types';
import {ATTRIBUTE_EVENTS} from './constants';

export const initialAttributeState: AttributeState = {
	attribute: [],
	loadingData: false,
};

export const defaultAttributeAction: AttributeAction = {
	payload: null,
	type: ATTRIBUTE_EVENTS.EMPTY_DATA
};
