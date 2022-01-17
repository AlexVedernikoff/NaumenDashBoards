// @flow
import {createSchema, string} from 'GroupModal/schema';
import type {LangType} from 'localization/localize_types';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS: Array<{label: LangType, value: string}> = [
	{
		label: 'GroupModal::Contains',
		value: OR_CONDITION_TYPES.CONTAINS
	},
	{
		label: 'GroupModal::NotContains',
		value: OR_CONDITION_TYPES.NOT_CONTAINS
	},
	{
		label: 'GroupModal::NotContainsIncludingEmpty',
		value: OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_EMPTY
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
