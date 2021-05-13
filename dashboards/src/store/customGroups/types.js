// @flow
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {CUSTOM_GROUPS_EVENTS, OR_CONDITION_SETS, OR_CONDITION_TYPES} from './constants';
import {INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';
import type {ThunkAction} from 'store/types';

export type StringSimpleOperand = {|
	data: string,
	type: $Keys<typeof OR_CONDITION_SETS.STRING>
|};

export type DateSimpleOperand = {|
	data: string,
	type: $Keys<typeof OR_CONDITION_SETS.SIMPLE_DATE>
|};

export type NumberSimpleOperand = {|
	data: string,
	type: $Keys<typeof OR_CONDITION_SETS.NUMBER>
|};

export type RefSimpleOperand = {|
	data: string,
	type: $Keys<typeof OR_CONDITION_SETS.SIMPLE_REF>
|};

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

export type IntervalOrCondition = {|
	data: IntervalData,
	type: $Keys<typeof OR_CONDITION_SETS.INTERVAL>
|};

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

export type BetweenOrCondition = {
	data: BetweenData,
	type: typeof OR_CONDITION_TYPES.BETWEEN | typeof OR_CONDITION_TYPES.EXPIRES_BETWEEN
};

export type DateOrCondition =
	| BetweenOrCondition
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
export type SelectData = Object;

export type SelectOrCondition = {
	data: SelectData | null,
	type: $Keys<typeof OR_CONDITION_SETS.REF> | $Keys<typeof OR_CONDITION_SETS.TIMER>
};

export type MultiSelectOperand = {|
	data: Array<Object>,
	type: typeof OR_CONDITION_TYPES.CONTAINS_ANY
|};

export type RefOrCondition =
	| MultiSelectOperand
	| RefSimpleOperand
	| SelectOrCondition
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
	type: $Keys<typeof ATTRIBUTE_SETS.REFERENCE>
|};

// Группировка для счетчиков
export type TimerOrCondition =
	| BetweenOrCondition
	| SelectOrCondition
;

export type TimerAndCondition = Array<TimerOrCondition>;

export type TimerSubGroup = {
	data: Array<TimerAndCondition>,
	name: string
};

export type TimerCustomGroup = {|
	id: string,
	name: string,
	subGroups: Array<TimerSubGroup>,
	type: typeof ATTRIBUTE_TYPES.backTimer | typeof ATTRIBUTE_TYPES.timer
|};

export type CustomGroup =
	| DateCustomGroup
	| IntervalCustomGroup
	| NumberCustomGroup
	| RefCustomGroup
	| StringCustomGroup
	| TimerCustomGroup
;

export type CustomGroupItem = {
	data: CustomGroup,
	loading: boolean
};

export type CustomGroupsMap = {
	[string]: CustomGroupItem
};

type CustomGroupFulfilled = {
	payload: CustomGroup,
	type: typeof CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_FULFILLED
};

type CustomGroupPending = {
	payload: string,
	type: typeof CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_PENDING
};

type CustomGroupRejected = {
	payload: string,
	type: typeof CUSTOM_GROUPS_EVENTS.CUSTOM_GROUP_REJECTED
};

type CustomGroupsFulfilled = {
	payload: Array<CustomGroup>,
	type: typeof CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_FULFILLED
};

type CustomGroupsPending = {
	type: typeof CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_PENDING
};

type CustomGroupsRejected = {
	type: typeof CUSTOM_GROUPS_EVENTS.CUSTOM_GROUPS_REJECTED
};

type RemoveCustomGroup = {
	payload: string,
	type: typeof CUSTOM_GROUPS_EVENTS.REMOVE_CUSTOM_GROUP
};

type SaveCustomGroup = {
	payload: CustomGroup,
	type: typeof CUSTOM_GROUPS_EVENTS.SAVE_CUSTOM_GROUP
};

type UnknownCustomGroupsAction = {
	type: typeof CUSTOM_GROUPS_EVENTS.UNKNOWN_CUSTOM_GROUPS_ACTION
};

export type CustomGroupsAction =
	| CustomGroupFulfilled
	| CustomGroupPending
	| CustomGroupRejected
	| CustomGroupsFulfilled
	| CustomGroupsPending
	| CustomGroupsRejected
	| RemoveCustomGroup
	| SaveCustomGroup
	| UnknownCustomGroupsAction
;

export type CustomGroupsState = {
	error: boolean,
	loading: boolean,
	map: CustomGroupsMap
};
