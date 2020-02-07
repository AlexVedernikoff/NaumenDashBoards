// @flow
import {createDefaultGroup} from 'store/widgets/helpers';
import {DATETIME_SYSTEM_GROUP, DEFAULT_SYSTEM_GROUP} from 'store/widgets/constants';
import {DATETIME_SYSTEM_OPTIONS, DEFAULT_SYSTEM_OPTIONS} from './constants';
import {TYPES} from 'store/sources/attributes/constants';

const getSystemGroupOptions = (attribute: Object | null) => {
	if (attribute && TYPES.DATE.includes(attribute.type)) {
		return DATETIME_SYSTEM_OPTIONS;
	}

	return DEFAULT_SYSTEM_OPTIONS;
};

const getDefaultSystemGroup = (attribute: Object) => TYPES.DATE.includes(attribute.type)
		? createDefaultGroup(DATETIME_SYSTEM_GROUP.MONTH)
		: createDefaultGroup(DEFAULT_SYSTEM_GROUP.OVERLAP);

export {
	getDefaultSystemGroup,
	getSystemGroupOptions
};
