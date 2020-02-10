// @flow
import type {CustomGroupsMap} from 'store/customGroups/types';
import {DATETIME_SYSTEM_GROUP, DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from './constants';
import {TYPES} from 'store/sources/attributes/constants';

const createDefaultGroup = (data: string) => ({
	data,
	way: GROUP_WAYS.SYSTEM
});

const isGroupKey = (key: string) => /group/i.test(key);

const transformGroupFormat = (object: Object, customGroups: CustomGroupsMap) => {
	Object.keys(object).filter(isGroupKey).forEach(key => {
		let value = object[key];

		if (typeof value === 'string') {
			value = createDefaultGroup(value);
		}

		if (value && typeof value === 'object' && value.way === GROUP_WAYS.CUSTOM) {
			value = {...value, data: customGroups[value.data]};
		}

		object[key] = value;
	});
};

const getDefaultSystemGroup = (attribute: Object) => TYPES.DATE.includes(attribute.type)
	? createDefaultGroup(DATETIME_SYSTEM_GROUP.MONTH)
	: createDefaultGroup(DEFAULT_SYSTEM_GROUP.OVERLAP);

export {
	createDefaultGroup,
	getDefaultSystemGroup,
	isGroupKey,
	transformGroupFormat
};
