// @flow
import {CUSTOM_GROUPS_EVENTS, OPERAND_SETS, OPERAND_TYPES} from './constants';
import type {GroupType} from 'store/widgets/data/types';

export type BetweenData = {
	endDate: string,
	startDate: string
};

export type SimpleType = $Keys<typeof OPERAND_SETS.SIMPLE>;

export type SelectData = {
	title: string,
	uuid: string
};

export type SelectType = $Keys<typeof OPERAND_SETS.SELECT>;

export type BetweenOperand = {|
	data: BetweenData,
	type: typeof OPERAND_TYPES.BETWEEN
|};

export type SelectOperand = {|
	data: SelectData | null,
	type: SelectType
|};

export type SimpleOperand = {|
	data: string,
	type: SimpleType
|};

export type MultiSelectOperand = {|
	data: Array<Object>,
	type: typeof OPERAND_TYPES.CONTAINS_ANY
|};

export type OperandType = $Keys<typeof OPERAND_TYPES>;

export type OrCondition =
	| BetweenOperand
	| SelectOperand
	| SimpleOperand
	| MultiSelectOperand
;

export type AndCondition = Array<OrCondition>;

export type SubGroup = {
	data: Array<AndCondition>,
	name: string
};

export type CustomGroupId = string;

export type CustomGroup = {
	id: CustomGroupId,
	name: string,
	subGroups: Array<SubGroup>,
	type: GroupType
};

export type CustomGroupsMap = {
	[CustomGroupId]: CustomGroup
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
