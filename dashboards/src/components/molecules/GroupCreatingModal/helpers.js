// @flow
import {CONDITION_TYPES} from 'store/customGroups/constants';
import {DATETIME_SYSTEM_OPTIONS} from './constants';
import type {GroupType} from 'store/widgets/data/types';
import {GROUP_TYPES} from 'store/widgets/constants';
import {TYPES} from 'store/sources/attributes/constants';

const createNewSubGroup = (type: GroupType) => ({
	data: [createNewAndCondition(type)],
	name: ''
});

const createNewAndCondition = (type: GroupType) => ([createNewOrCondition(type)]);

const createNewOrCondition = (type: GroupType) => ({
	data: null,
	type: getDefaultConditionType(type)
});

const getDefaultConditionType = (type: GroupType) => {
	const {DATETIME, INTEGER} = GROUP_TYPES;
	const {BETWEEN, EQUAL} = CONDITION_TYPES;

	switch (type) {
		case DATETIME:
			return BETWEEN;
		case INTEGER:
			return EQUAL;
		default:
			return '';
	}
};

const getSystemGroupOptions = (attribute: Object | null) => {
	if (attribute && TYPES.DATE.includes(attribute.type)) {
		return DATETIME_SYSTEM_OPTIONS;
	}

	return [];
};

export {
	createNewAndCondition,
	createNewOrCondition,
	createNewSubGroup,
	getSystemGroupOptions
};
