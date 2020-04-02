// @flow
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {CUSTOM_GROUPS_EVENTS, OPERAND_SETS, OPERAND_TYPES} from './constants';
import {INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';

export type OperandType = $Keys<typeof OPERAND_TYPES>;

export type StringSimpleOperand = {|
	data: string,
	type: $Keys<typeof OPERAND_SETS.STRING>
|};

export type DateSimpleOperand = {|
	data: string,
	type: $Keys<typeof OPERAND_SETS.SIMPLE_DATE>
|};

export type NumberSimpleOperand = {|
	data: string,
	type: $Keys<typeof OPERAND_SETS.NUMBER>
|};

export type RefSimpleOperand = {|
	data: string,
	type: $Keys<typeof OPERAND_SETS.SIMPLE_REF>
|};

export type SimpleOperand =
	| DateSimpleOperand
	| NumberSimpleOperand
	| RefSimpleOperand
	| StringSimpleOperand;

// Группировка для атрибута типа строка
export type StringOrCondition = StringSimpleOperand;

export type StringAndCondition = Array<StringOrCondition>;

export type StringSubGroup = {
	data: Array<StringAndCondition>,
	name: string
};

export type StringCustomGroup = {|
	id: string,
	name: string,
	subGroups: Array<StringSubGroup>,
	type: $Keys<typeof ATTRIBUTE_SETS.NUMBER>
|};

// Группировка для атрибута типа число
export type NumberOrCondition = NumberSimpleOperand;

export type NumberAndCondition = Array<NumberOrCondition>;

export type NumberSubGroup = {
	data: Array<NumberAndCondition>,
	name: string
};

export type NumberCustomGroup = {|
	id: string,
	name: string,
	subGroups: Array<NumberSubGroup>,
	type: $Keys<typeof ATTRIBUTE_SETS.NUMBER>
|};

// Группировка для атрибута типа интервал
export type IntervalData = {
	type: $Keys<typeof INTERVAL_SYSTEM_GROUP>,
	value: string
};

export type IntervalOperand = {|
	data: IntervalData,
	type: $Keys<typeof OPERAND_SETS.INTERVAL>
|};

export type IntervalOrCondition = IntervalOperand;

export type IntervalAndCondition = Array<IntervalOrCondition>;

export type IntervalSubGroup = {
	data: Array<IntervalAndCondition>,
	name: string
};

export type IntervalCustomGroup = {|
	id: string,
	name: string,
	subGroups: Array<IntervalSubGroup>,
	type: $Keys<typeof ATTRIBUTE_SETS.NUMBER>
|};

// Группировка для атрибута типа дата
export type BetweenData = {
	endDate: string,
	startDate: string
};

export type BetweenOperand = {|
	data: BetweenData,
	type: typeof OPERAND_TYPES.BETWEEN
|};

export type DateOrCondition =
	| BetweenOperand
	| DateSimpleOperand
;

export type DateAndCondition = Array<DateOrCondition>;

export type DateSubGroup = {
	data: Array<DateAndCondition>,
	name: string
};

export type DateCustomGroup = {|
	id: string,
	name: string,
	subGroups: Array<DateSubGroup>,
	type: $Keys<typeof ATTRIBUTE_SETS.DATE>
|};

// Группировка для ссылочных атрибутов
export type SelectData = {
	title: string,
	uuid: string
};

export type SelectOperand = {|
	data: SelectData | null,
	type: $Keys<typeof OPERAND_SETS.REF>
|};

export type MultiSelectOperand = {|
	data: Array<Object>,
	type: typeof OPERAND_TYPES.CONTAINS_ANY
|};

export type RefOrCondition =
	| MultiSelectOperand
	| RefSimpleOperand
	| SelectOperand
;

export type RefAndCondition = Array<RefOrCondition>;

export type RefSubGroup = {
	data: Array<RefAndCondition>,
	name: string
};

export type RefCustomGroup = {|
	id: string,
	name: string,
	subGroups: Array<RefSubGroup>,
	type: $Keys<typeof ATTRIBUTE_SETS.REF>
|};

export type CustomGroup =
	| DateCustomGroup
	| IntervalCustomGroup
	| NumberCustomGroup
	| RefCustomGroup
	| StringCustomGroup
;

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
