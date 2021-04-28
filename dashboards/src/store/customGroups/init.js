// @flow
import type {CustomGroupsAction, CustomGroupsState} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';

export const initialCustomGroupsState: CustomGroupsState = {
	error: false,
	loading: false,
	map: {}
};

export const defaultCustomGroupsAction: CustomGroupsAction = {
	type: CUSTOM_GROUPS_EVENTS.UNKNOWN_CUSTOM_GROUPS_ACTION
};
