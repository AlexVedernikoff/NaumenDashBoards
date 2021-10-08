// @flow
import {ATTRIBUTE_EVENTS} from './constants';

export type AttributeAction = {
	type: typeof ATTRIBUTE_EVENTS.EMPTY_DATA,
};

export type AttributeState = {
	attribute: [],
};
