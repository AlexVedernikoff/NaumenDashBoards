// @flow
import {array, createSchema} from 'GroupModal/schema';
import {INTERVAL_SYSTEM_GROUP} from 'src/store/widgets/constants';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS = [
	{
		label: 'равен',
		value: OR_CONDITION_TYPES.EQUAL
	},
	{
		label: 'не равен',
		value: OR_CONDITION_TYPES.NOT_EQUAL
	},
	{
		label: 'больше',
		value: OR_CONDITION_TYPES.GREATER
	},
	{
		label: 'меньше',
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

const OPTIONS = [
	{
		label: 'Минут',
		value: INTERVAL_SYSTEM_GROUP.MINUTE
	},
	{
		label: 'Часов',
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
