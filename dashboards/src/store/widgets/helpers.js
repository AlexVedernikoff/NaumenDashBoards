// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {DATETIME_SYSTEM_GROUP, DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from './constants';
import type {Group} from './data/types';
import {store} from 'src';

const createDefaultGroup = (data?: string | null, attribute?: Attribute) => {
	if (!data || typeof data !== 'string') {
		return getDefaultSystemGroup(attribute);
	}

	return ({
		data,
		way: GROUP_WAYS.SYSTEM
	});
};

const isGroupKey = (key: string) => /group/i.test(key);

const transformGroupFormat = (group?: Group, extendCustom: boolean = true) => {
	let resultGroup = group;

	if (!group || typeof group !== 'object') {
		resultGroup = createDefaultGroup(group);
	} else if (extendCustom && group.way === GROUP_WAYS.CUSTOM) {
		const {customGroups} = store.getState();

		resultGroup = {
			...group,
			data: customGroups[group.data]
		};
	}

	return resultGroup;
};

const getDefaultSystemGroup = (attribute: Object) => attribute && typeof attribute === 'object' && attribute.type in ATTRIBUTE_SETS.DATE
	? createDefaultGroup(DATETIME_SYSTEM_GROUP.MONTH)
	: createDefaultGroup(DEFAULT_SYSTEM_GROUP.OVERLAP);

export {
	createDefaultGroup,
	getDefaultSystemGroup,
	isGroupKey,
	transformGroupFormat
};
