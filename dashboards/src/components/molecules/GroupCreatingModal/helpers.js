// @flow
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {DATETIME_SYSTEM_OPTIONS} from './constants';
import type {GroupType} from 'store/widgets/data/types';
import type {OperandType, OrCondition} from 'store/customGroups/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';

const getDefaultOperandType = (type: GroupType) => {
	const {metaClass, state} = ATTRIBUTE_TYPES;
	const {DATE, NUMBER, REF} = ATTRIBUTE_SETS;
	const {BETWEEN, CONTAINS, EQUAL} = OPERAND_TYPES;

	if (DATE.includes(type)) {
		return BETWEEN;
	}

	if (NUMBER.includes(type)) {
		return EQUAL;
	}

	if (REF.includes(type) || type === metaClass || type === state) {
		return CONTAINS;
	}
};

const getSystemGroupOptions = (attribute: Object | null) => {
	if (attribute && ATTRIBUTE_SETS.DATE.includes(attribute.type)) {
		return DATETIME_SYSTEM_OPTIONS;
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

const createMultiOperand = (type: any) => ({
	data: [],
	type
});

const createSimpleOperand = (type: any) => ({
	data: '',
	type
});

const createDefaultOperand = (type: any) => ({
	data: null,
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
		andCondition.push(createNewOrCondition(operandType));
	}

	return andCondition;
};

const createNewOrCondition = (type: OperandType): OrCondition => {
	const {
		BETWEEN,
		CONTAINS_ANY,
		EQUAL,
		GREATER,
		LAST,
		LESS,
		NEAR,
		NOT_EQUAL,
		NOT_EQUAL_NOT_EMPTY,
		TITLE_CONTAINS,
		TITLE_NOT_CONTAINS
	} = OPERAND_TYPES;

	switch (type) {
		case BETWEEN:
			return createBetweenOperand(type);
		case CONTAINS_ANY:
			return createMultiOperand(type);
		case EQUAL:
		case GREATER:
		case LAST:
		case LESS:
		case NEAR:
		case NOT_EQUAL:
		case NOT_EQUAL_NOT_EMPTY:
		case TITLE_CONTAINS:
		case TITLE_NOT_CONTAINS:
			return createSimpleOperand(type);
		default:
			return createDefaultOperand(type);
	}
};

export {
	createNewAndCondition,
	createNewOrCondition,
	createNewSubGroup,
	getDefaultOperandType,
	getSystemGroupOptions
};
