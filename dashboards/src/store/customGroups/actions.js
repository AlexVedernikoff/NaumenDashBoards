// @flow
import type {CustomGroup} from './types';
import {CUSTOM_GROUPS_EVENTS} from './constants';

const removeCustomGroup = (payload: string) => ({
	type: CUSTOM_GROUPS_EVENTS.REMOVE_CUSTOM_GROUP,
	payload
});

const saveCustomGroup = (payload: CustomGroup) => ({
	type: CUSTOM_GROUPS_EVENTS.SAVE_CUSTOM_GROUP,
	payload
});

export {
	removeCustomGroup,
	saveCustomGroup
};
