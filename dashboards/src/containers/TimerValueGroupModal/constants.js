// @flow
import {array, createSchema} from 'GroupModal/schema';
import {INTERVAL_SYSTEM_GROUP} from 'src/store/widgets/constants';
import type {LangType} from 'localization/localize_types';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS: Array<{label: LangType, value: string}> = [
	{
		label: 'TimerValueGroupModal::Equal',
		value: OR_CONDITION_TYPES.EQUAL
	},
	{
		label: 'TimerValueGroupModal::NotEqual',
		value: OR_CONDITION_TYPES.NOT_EQUAL
	},
	{
		label: 'TimerValueGroupModal::Greater',
		value: OR_CONDITION_TYPES.GREATER
	},
	{
		label: 'TimerValueGroupModal::Less',
		value: OR_CONDITION_TYPES.LESS
	},
	{
		label: 'TimerValueGroupModal::Empty',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'TimerValueGroupModal::NotEmpty',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	}
];

const OPTIONS: Array<{label: LangType, value: string}> = [
	{
		label: 'TimerValueGroupModal::Minute',
		value: INTERVAL_SYSTEM_GROUP.MINUTE
	},
	{
		label: 'TimerValueGroupModal::Hour',
		value: INTERVAL_SYSTEM_GROUP.HOUR
	}
];

const SCHEMA = createSchema((condition: OrCondition) => {
	const {EQUAL, GREATER, LESS, NOT_EQUAL} = OR_CONDITION_TYPES;

	switch (condition.type) {
		case EQUAL:
		case NOT_EQUAL:
		case GREATER:
		case LESS:
			return array().intervalArray();
	}
});

export {
	OR_CONDITION_OPTIONS,
	OPTIONS,
	SCHEMA
};
