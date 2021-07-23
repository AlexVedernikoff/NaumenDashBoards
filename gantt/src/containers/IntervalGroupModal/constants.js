// @flow
import {createSchema, object} from 'GroupModal/schema';
import {INTERVAL_SYSTEM_GROUP} from 'store/widgets/constants';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS = [
	{
		label: 'равно',
		value: OR_CONDITION_TYPES.EQUAL
	},
	{
		label: 'не равно (и не пусто)',
		value: OR_CONDITION_TYPES.NOT_EQUAL
	},
	{
		label: 'больше',
		value: OR_CONDITION_TYPES.GREATER
	},
	{
		label: 'менее',
		value: OR_CONDITION_TYPES.LESS
	},
	{
		label: 'пусто',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	}
];

const SYSTEM_OPTIONS = [
	{
		label: 'Секунды',
		value: INTERVAL_SYSTEM_GROUP.SECOND
	},
	{
		label: 'Минуты',
		value: INTERVAL_SYSTEM_GROUP.MINUTE
	},
	{
		label: 'Часы',
		value: INTERVAL_SYSTEM_GROUP.HOUR
	},
	{
		label: 'Дни',
		value: INTERVAL_SYSTEM_GROUP.DAY
	},
	{
		label: 'Недели',
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
