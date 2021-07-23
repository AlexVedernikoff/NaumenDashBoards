// @flow
import type {RefAttributesAction, RefAttributesState} from './types';
import {REF_ATTRIBUTES_EVENTS} from './constants';

export const initialRefAttributesState: RefAttributesState = {};

export const defaultRefAttributesAction: RefAttributesAction = {
	type: REF_ATTRIBUTES_EVENTS.UNKNOWN_REF_ATTRIBUTES_ACTION
};
