// @flow
import {CONDITION_TYPES, CUSTOM_GROUPS_EVENTS} from './constants';
import type {GroupType} from 'store/widgets/data/types';

export type BetweenOperandData = {
	endDate: string,
	startDate: string
};

export type OperandData =
	| BetweenOperandData
	| number
;

export type ConditionType = $Keys<typeof CONDITION_TYPES>;

export type OrCondition = {
	data: OperandData | null,
	type: $Keys<typeof CONDITION_TYPES> | ''
};

export type AndCondition = Array<OrCondition>;

export type SubGroup = {
	data: Array<AndCondition>,
	name: string
};

export type CustomGroupId = string | Symbol;

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
