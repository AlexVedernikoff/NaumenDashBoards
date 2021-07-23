// @flow
import {createSchema, string} from 'GroupModal/schema';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS = [
	{
		label: 'Содержит',
		value: OR_CONDITION_TYPES.CONTAINS
	},
	{
		label: 'Не содержит',
		value: OR_CONDITION_TYPES.NOT_CONTAINS
	},
	{
		label: 'Не содержит (включая пустые)',
		value: OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_EMPTY
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

const SCHEMA = createSchema((condition: OrCondition) => {
	const {CONTAINS, NOT_CONTAINS, NOT_CONTAINS_INCLUDING_EMPTY} = OR_CONDITION_TYPES;

	switch (condition.type) {
		case CONTAINS:
		case NOT_CONTAINS:
		case NOT_CONTAINS_INCLUDING_EMPTY:
			return string().isString();
	}
});

export {
	OR_CONDITION_OPTIONS,
	SCHEMA
};
