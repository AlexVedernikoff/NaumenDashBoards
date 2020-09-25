// @flow
import type {CustomGroupsAction, CustomGroupsState} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';

export const initialCustomGroupsState: CustomGroupsState = {
	editable: {},
	original: {}
};

export const defaultCustomGroupsAction: CustomGroupsAction = {
	type: CUSTOM_GROUPS_EVENTS.UNKNOWN_CUSTOM_GROUPS_ACTION
};
