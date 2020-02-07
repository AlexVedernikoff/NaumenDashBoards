// @flow
import type {CustomGroupsMap} from 'store/customGroups/types';
import {GROUP_TYPES} from './constants';

const createDefaultGroup = (data: string) => ({
	data,
	type: GROUP_TYPES.SYSTEM
});

const isGroupKey = (key: string) => /group/i.test(key);

const transformGroupFormat = (object: Object, customGroups: CustomGroupsMap) => {
	Object.keys(object).filter(isGroupKey).forEach(key => {
		let value = object[key];

		if (typeof value === 'string') {
			value = createDefaultGroup(value);
		}

		if (value && typeof value === 'object' && value.type === GROUP_TYPES.CUSTOM) {
			value = {...value, data: customGroups[value.data]};
		}

		object[key] = value;
	});
};

export {
	createDefaultGroup,
	isGroupKey,
	transformGroupFormat
};
