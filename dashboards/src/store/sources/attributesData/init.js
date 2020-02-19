// @flow
import type {AttributesDataAction, AttributesDataState} from './types';
import {ATTRIBUTES_DATA_EVENTS} from './constants';

export const initialAttributesDataState: AttributesDataState = {
	actualValues: {},
	allValues: {},
	metaClasses: {},
	states: {}
};

export const defaultAttributesDataAction: AttributesDataAction = {
	type: ATTRIBUTES_DATA_EVENTS.UNKNOWN_ATTRIBUTES_DATA_ACTION
};
