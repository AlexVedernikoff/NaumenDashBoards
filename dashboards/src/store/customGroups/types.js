// @flow
import {CUSTOM_GROUPS_EVENTS, CUSTOM_GROUP_TYPES, OPERAND_TYPES, OPERATORS} from './constants';

export type BetweenOperandData = {
	endDate: string,
	startDate: string
};

export type OperandData =
	| BetweenOperandData
	| number
;

export type Operand = {
	data: OperandData | null,
	type: $Keys<typeof OPERAND_TYPES>
};

export type Operator = $Keys<typeof OPERATORS>;

export type Condition = {
	id: string,
	next: string,
	operand: Operand,
	operator: Operator | null,
};

export type ConditionsMap = {
	[string]: Condition
};

export type SubGroup = {
	conditions: {
		first: string,
		map: ConditionsMap
	},
	id: string,
	name: string,
	next: string,
};

export type SubGroupsMap = {
	[string]: SubGroup
};

export type CustomGroupType = $Keys<typeof CUSTOM_GROUP_TYPES>;

export type CustomGroup = {
	id: string,
	name: string,
	subGroups: {
		first: string,
		last: string,
		map: SubGroupsMap
	},
	type: CustomGroupType
};

export type CustomGroupsMap = {
	[string]: CustomGroup
};

type RemoveCustomGroup = {
	type: typeof CUSTOM_GROUPS_EVENTS.REMOVE_CUSTOM_GROUP,
	payload: string
};

type SaveCustomGroup = {
	type: typeof CUSTOM_GROUPS_EVENTS.SAVE_CUSTOM_GROUP,
	payload: CustomGroup
};

type SetCustomGroups = {
	type: typeof CUSTOM_GROUPS_EVENTS.SET_CUSTOM_GROUPS,
	payload: CustomGroupsMap
};

type UnknownCustomGroupsAction = {
	type: typeof CUSTOM_GROUPS_EVENTS.UNKNOWN_CUSTOM_GROUPS_ACTION
};

export type CustomGroupsAction =
	| RemoveCustomGroup
	| SaveCustomGroup
	| SetCustomGroups
	| UnknownCustomGroupsAction
;

export type CustomGroupsState = CustomGroupsMap;
