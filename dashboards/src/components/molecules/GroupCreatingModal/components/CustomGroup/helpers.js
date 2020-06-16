// @flow
import {INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';
import type {OrCondition} from './types';

const createBetweenOperand = (type: string) => ({
	data: {
		endDate: '',
		startDate: ''
	},
	type
});

const createDefaultOperand = (type: string) => ({
	data: null,
	type
});

const createIntervalOperand = (type: string) => ({
	data: {
		type: INTERVAL_SYSTEM_GROUP.HOUR,
		value: ''
	},
	type
});

const createMultiSelectOperand = (type: string) => ({
	data: [],
	type
});

const createSimpleOperand = (type: string, data?: string) => ({
	data: data || '',
	type
});

const createNewSubGroup = (orCondition: OrCondition) => ({
	data: [createNewAndCondition(orCondition)],
	name: ''
});

const createNewAndCondition = (orCondition: OrCondition) => [orCondition];

export {
	createBetweenOperand,
	createDefaultOperand,
	createIntervalOperand,
	createNewAndCondition,
	createNewSubGroup,
	createMultiSelectOperand,
	createSimpleOperand
};
