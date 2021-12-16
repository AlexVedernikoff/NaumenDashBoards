// @flow
import {createSchema, object} from 'GroupModal/schema';
import {INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';
import type {LangType} from 'localization/localize_types';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS: Array<{label: LangType, value: string}> = [
	{
		label: 'GroupModal::Equal',
		value: OR_CONDITION_TYPES.EQUAL
	},
	{
		label: 'GroupModal::NotEqual',
		value: OR_CONDITION_TYPES.NOT_EQUAL
	},
	{
		label: 'GroupModal::Greater',
		value: OR_CONDITION_TYPES.GREATER
	},
	{
		label: 'GroupModal::Less',
		value: OR_CONDITION_TYPES.LESS
	},
	{
		label: 'GroupModal::Empty',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'GroupModal::NotEmpty',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	}
];

const SYSTEM_OPTIONS: Array<{label: LangType, value: $Keys<typeof INTERVAL_SYSTEM_GROUP>}> = [
	{
		label: 'IntervalGroupModal::Second',
		value: INTERVAL_SYSTEM_GROUP.SECOND
	},
	{
		label: 'IntervalGroupModal::Minute',
		value: INTERVAL_SYSTEM_GROUP.MINUTE
	},
	{
		label: 'IntervalGroupModal::Hour',
		value: INTERVAL_SYSTEM_GROUP.HOUR
	},
	{
		label: 'IntervalGroupModal::Day',
		value: INTERVAL_SYSTEM_GROUP.DAY
	},
	{
		label: 'IntervalGroupModal::Week',
		value: INTERVAL_SYSTEM_GROUP.WEEK
	}
];

const SCHEMA = createSchema((condition: OrCondition) => {
	const {EQUAL, GREATER, LESS, NOT_EQUAL} = OR_CONDITION_TYPES;

	switch (condition.type) {
		case EQUAL:
		case GREATER:
		case LESS:
		case NOT_EQUAL:
			return object().interval();
	}
});

export {
	OR_CONDITION_OPTIONS,
	SCHEMA,
	SYSTEM_OPTIONS
};
