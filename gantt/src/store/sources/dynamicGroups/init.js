// @flow
import type {DynamicGroupsAction, DynamicGroupsState} from './types';
import {DYNAMIC_GROUPS_EVENTS} from './constants';

export const initialGroupsState: DynamicGroupsState = {};

export const defaultGroupsAction: DynamicGroupsAction = {
	type: DYNAMIC_GROUPS_EVENTS.UNKNOWN_DYNAMIC_GROUPS_ACTION
};
