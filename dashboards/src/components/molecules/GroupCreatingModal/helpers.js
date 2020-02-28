// @flow
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {DATETIME_SYSTEM_OPTIONS, INTERVAL_SYSTEM_OPTIONS} from './constants';
import type {GroupType} from 'store/widgets/data/types';
import {INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';
import {OPERAND_TYPES} from 'store/customGroups/constants';

const getDefaultOperandType = (type: GroupType) => {
	const {dtInterval, metaClass, state, string} = ATTRIBUTE_TYPES;
	const {DATE, NUMBER, REF} = ATTRIBUTE_SETS;
	const {BETWEEN, CONTAINS, EMPTY, EQUAL} = OPERAND_TYPES;

	if (type in DATE) {
		return BETWEEN;
	}

	if (type in NUMBER || type === dtInterval) {
		return EQUAL;
	}

	if (type in REF || type === metaClass || type === state) {
		return CONTAINS;
	}

	if (type === string) {
		return EMPTY;
	}
};

const getSystemGroupOptions = (attribute: Object | null) => {
	if (attribute) {
		if (attribute.type in ATTRIBUTE_SETS.DATE) {
			return DATETIME_SYSTEM_OPTIONS;
		}

		if (attribute.type === ATTRIBUTE_TYPES.dtInterval) {
			return INTERVAL_SYSTEM_OPTIONS;
		}
	}

	return [];
};

const createBetweenOperand = (type: any) => ({
	data: {
		endDate: '',
		startDate: ''
	},
	type
});

const createMultiSelectOperand = type => ({
	data: [],
	type
});

const createSimpleOperand = type => ({
	data: '',
	type
});

const createDefaultOperand = type => ({
	data: null,
	type
});

const createIntervalOperand = type => ({
	data: {
		type: INTERVAL_SYSTEM_GROUP.HOUR,
		value: ''
	},
	type
});

const createNewSubGroup = (type: GroupType) => ({
	data: [createNewAndCondition(type)],
	name: ''
});

const createNewAndCondition = (type: GroupType) => {
	const andCondition = [];
	const operandType = getDefaultOperandType(type);

	if (operandType) {
		const orCondition = createNewOrCondition(type, operandType) || createDefaultOperand(operandType);
		andCondition.push(orCondition);
	}

	return andCondition;
};

const createDateCondition = type => {
	const {BETWEEN, LAST, NEAR} = OPERAND_TYPES;

	switch (type) {
		case BETWEEN:
			return createBetweenOperand(type);
		case LAST:
		case NEAR:
			return createSimpleOperand(type);
	}
};

const createNumberCondition = type => {
	const {EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY} = OPERAND_TYPES;

	switch (type) {
		case EQUAL:
		case GREATER:
		case LESS:
		case NOT_EQUAL:
		case NOT_EQUAL_NOT_EMPTY:
			return createSimpleOperand(type);
	}
};

const createIntervalCondition = type => {
	const {EQUAL, GREATER, LESS, NOT_EQUAL} = OPERAND_TYPES;

	switch (type) {
		case EQUAL:
		case GREATER:
		case LESS:
		case NOT_EQUAL:
			return createIntervalOperand(type);
	}
};

const createRefCondition = type => {
	const {
		CONTAINS,
		CONTAINS_ANY,
		CONTAINS_ATTR_CURRENT_OBJECT,
		CONTAINS_INCLUDING_ARCHIVAL,
		CONTAINS_INCLUDING_NESTED,
		EQUAL_ATTR_CURRENT_OBJECT,
		NOT_CONTAINS,
		NOT_CONTAINS_INCLUDING_ARCHIVAL,
		TITLE_CONTAINS,
		TITLE_NOT_CONTAINS
	} = OPERAND_TYPES;

	switch (type) {
		case CONTAINS:
		case CONTAINS_ATTR_CURRENT_OBJECT:
		case CONTAINS_INCLUDING_ARCHIVAL:
		case CONTAINS_INCLUDING_NESTED:
		case EQUAL_ATTR_CURRENT_OBJECT:
		case NOT_CONTAINS:
		case NOT_CONTAINS_INCLUDING_ARCHIVAL:
			return createDefaultOperand(type);
		case CONTAINS_ANY:
			return createMultiSelectOperand(type);
		case TITLE_CONTAINS:
		case TITLE_NOT_CONTAINS:
			return createSimpleOperand(type);
	}
};

const createStringCondition = type => {
	const {CONTAINS, NOT_CONTAINS, NOT_CONTAINS_INCLUDING_EMPTY} = OPERAND_TYPES;

	switch (type) {
		case CONTAINS:
		case NOT_CONTAINS:
		case NOT_CONTAINS_INCLUDING_EMPTY:
			return createSimpleOperand(type);
	}
};

const createNewOrCondition = (attributeType: GroupType, type: string): Object => {
	const {
		backBOLinks,
		boLinks,
		catalogItem,
		catalogItemSet,
		date,
		dateTime,
		double,
		dtInterval,
		integer,
		metaClass,
		object,
		state,
		string
	} = ATTRIBUTE_TYPES;

	switch (attributeType) {
		case date:
		case dateTime:
			return createDateCondition(type);
		case double:
		case integer:
			return createNumberCondition(type);
		case dtInterval:
			return createIntervalCondition(type);
		case backBOLinks:
		case boLinks:
		case catalogItem:
		case catalogItemSet:
		case metaClass:
		case object:
		case state:
			return createRefCondition(type);
		case string:
			return createStringCondition(type);
	}
};

export {
	createNewAndCondition,
	createNewOrCondition,
	createNewSubGroup,
	getDefaultOperandType,
	getSystemGroupOptions
};
